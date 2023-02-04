import { Kysely } from "kysely";
import { D1Kysely } from "../database/d1-kysely";
import { ContentSchema } from "../models/content-type.model";
import { ContentTypeRepository } from "../repositories/content-type.repository";
import { relationIdName, relationTableName } from "../utils/createKeyName";
import { parseFilters } from "../utils/parseFilters";
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
const ALLOWED_FILTERS = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "contain",
] as const;
const FILTER_SQL_OPERATORS = {
  eq: "=",
  neq: "!=",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  contain: "like",
} as const;

export class ContentItemQueryService {
  private db: Kysely<{ [key: string]: any }>;
  private typeRepo: ContentTypeRepository;

  constructor(inject: ContentItemQueryInjections) {
    this.db = new D1Kysely(inject.db);
    this.typeRepo = new ContentTypeRepository({ db: inject.db });
  }

  async queryContentItems(data: QueryContentItemData) {
    const contentType = await this.typeRepo.findByTableName(data.tableName);
    if (!contentType) throw new Error("invalid_table_name");
    const { schema, tableName } = contentType?.props;

    let query = this.db.selectFrom(data.tableName);

    for (const column of Object.keys(schema)) {
      if (schema[column].type === "reference-to-many") {
        const { referenceTo } = schema[column] as { referenceTo: string };
        const relateTableName = relationTableName(
          column,
          tableName,
          referenceTo
        );

        query = query
          .innerJoin(
            relateTableName,
            `${tableName}.id`,
            `${relateTableName}.${relationIdName(tableName)}`
          )
          .innerJoin(
            referenceTo,
            `${relateTableName}.${relationIdName(referenceTo)}`,
            `${referenceTo}.id`
          );
      }
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
      .selectAll()
      .offset(data.offset ?? 0)
      .limit(data.limit ?? DEFAULT_CONTENT_ITEM_LIMIT);

    return query.execute();
  }
}
