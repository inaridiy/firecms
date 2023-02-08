import { singularize as toS } from "../utils/inflection";
import { Kysely } from "kysely";
import { D1Kysely } from "../database/d1-kysely";
import { ContentTypeRepository } from "../repositories/content-type.repository";
import { relationIdName, relationTableName } from "../utils/createKeyName";
import {
  parseFilters,
  ALLOWED_FILTERS,
  FILTER_SQL_OPERATORS,
} from "../utils/parseFilters";
import { parseOrders } from "../utils/parseOrders";

export interface ContentItemQueryInjections {
  db: D1Database;
}

interface QueryContentItemData {
  tableName: string;
  ids?: string;
  q?: string;
  filters?: string;
  orders?: string;
  limit?: number;
  offset?: number;
}

const DEFAULT_CONTENT_ITEM_LIMIT = 30;

const REF_COLUMN_TYPES = ["reference-to-many", "reference-to-one"];

export class ContentItemQueryService {
  private db: Kysely<{ [key: string]: any }>;
  private typeRepo: ContentTypeRepository;

  constructor(inject: ContentItemQueryInjections) {
    this.db = new D1Kysely(inject.db);
    this.typeRepo = new ContentTypeRepository({ db: inject.db });
  }

  async queryContentTypes() {
    const contentTypeList = await this.typeRepo.findAll();
    const contentTypeEntries = contentTypeList.map(
      (cType) => [cType.props.tableName, cType.props] as const
    );
    const contentTypes = Object.fromEntries(contentTypeEntries);
    return contentTypes;
  }

  // TODO: Refactor this function
  async queryContentItems(data: QueryContentItemData) {
    const contentTypes = await this.queryContentTypes();
    if (!contentTypes[data.tableName]) throw new Error("invalid_table_name");
    const { schema, tableName } = contentTypes[data.tableName];

    const mainTableSelects = Object.keys(schema)
      .filter((key) => !REF_COLUMN_TYPES.includes(schema[key].type))
      .map((key) => `${tableName}.${key}`);

    let query = this.db
      .selectFrom(data.tableName)
      .select([`${tableName}.id`, ...mainTableSelects]);

    for (const column of Object.keys(schema)) {
      if (!REF_COLUMN_TYPES.includes(schema[column].type)) continue;
      const { referenceTo: refTo } = schema[column] as {
        referenceTo: string;
      };
      const relateTableName = relationTableName(column, tableName, refTo);
      const { schema: refSchema } = contentTypes[refTo];
      const refTableSelects = Object.keys(refSchema)
        .filter((s) => !REF_COLUMN_TYPES.includes(refSchema[s].type))
        .map((k) => `${refTo}.${k} as ${toS(refTo)}_${k}`);

      if (schema[column].type === "reference-to-many")
        query = query
          .innerJoin(
            relateTableName,
            `${tableName}.id`,
            `${relateTableName}.${relationIdName(tableName)}`
          )
          .innerJoin(
            refTo,
            `${relateTableName}.${relationIdName(refTo)}`,
            `${refTo}.id`
          )
          .select([
            `${refTo}.id as ${relationIdName(refTo)}`,
            ...refTableSelects,
          ]);
      else
        query = query
          .innerJoin(
            refTo,
            `${tableName}.${relationIdName(refTo)}`,
            `${refTo}.id`
          )
          .select([
            `${refTo}.id as ${relationIdName(refTo)}`,
            ...refTableSelects,
          ]);
    }

    if (data.ids) {
      const ids = data.ids.split(",");
      query = query.where("id", "in", ids);
    }

    //TODO: More efficient way to do this?
    if (data.q) {
      const textColumns = Object.keys(schema).filter(
        (key) => schema[key].sqlType === "text"
      );
      for (const columns of textColumns)
        query = query.orWhere(columns, "like", `%${data.q}%`);
    }

    if (data.orders) {
      const orders = parseOrders(data.orders);
      for (const order of orders)
        query = query.orderBy(order.field, order.direction);
    }

    if (data.filters) {
      const filters = parseFilters(data.filters, ALLOWED_FILTERS);
      for (const filter of filters) {
        const { field, operator, value } = filter;
        const column = schema[field];
        if (!column) throw new Error("invalid_field");
        if (operator === "contain")
          query = query.where(field, "like", `%${value}%`);
        else query = query.where(field, FILTER_SQL_OPERATORS[operator], value);
      }
    }

    query = query
      .offset(data.offset ?? 0)
      .limit(data.limit ?? DEFAULT_CONTENT_ITEM_LIMIT);

    const result = await query.execute();

    const groupedResult = result.reduce((obj, cur) => {
      const { id } = cur;
      if (id in obj) obj[id].push(cur);
      else obj[id] = [cur];
      return obj;
    }, {} as { [key: string]: any[] });

    const contentItems = Object.entries(groupedResult).map(([key, items]) => {
      const refColumns = Object.keys(schema)
        .filter((c) => REF_COLUMN_TYPES.includes(schema[c].type))
        .map((c) => c);

      let allRefKeys: string[] = [];
      let refFieldValues = {} as { [key: string]: any };

      for (const refColumn of refColumns) {
        const refType = schema[refColumn];
        const { referenceTo: refTo } = refType as { referenceTo: string };
        const refSchema = contentTypes[refTo].schema;
        const refKeys = Object.keys(refSchema)
          .filter((s) => !REF_COLUMN_TYPES.includes(refSchema[s].type))
          .map((k) => `${toS(refTo)}_${k}`)
          .concat(relationIdName(refTo));
        allRefKeys = [...allRefKeys, ...refKeys];

        for (const item of items) {
          const refItem = Object.entries(item)
            .filter(([key]) => refKeys.includes(key))
            .map(([key, value]) => [key.replace(`${toS(refTo)}_`, ""), value]);
          const refItemObj = Object.fromEntries(refItem);
          if (refType.type === "reference-to-one")
            refFieldValues[refColumn] = refItemObj;
          else if (refColumn in refFieldValues)
            refFieldValues[refColumn].push(refItemObj);
          else refFieldValues[refColumn] = [refItemObj];
        }
      }

      const mainItem = Object.entries(items[0]).reduce((obj, [key, value]) => {
        if (allRefKeys.includes(key)) return obj;
        obj[key] = value;
        return obj;
      }, {} as any);

      return { ...mainItem, ...refFieldValues };
    });

    return contentItems;
  }
}
