import { Kysely } from "kysely";
import { D1Kysely } from "../database/d1-kysely";
import { ContentSchema } from "../models/content-type.model";
import { ContentTypeRepository } from "../repositories/content-type.repository";
import { parseOrders } from "../utils/parseOrders";

export interface ContentItemQueryInjections {
  db: D1Database;
}

interface QueryContentItemData {
  tableName: string;
  ids?: string;
  q?: string;
  orders?: string;
  limit?: number;
  offset?: number;
}

const DEFAULT_CONTENT_ITEM_LIMIT = 30;

export class ContentItemQueryService {
  private db: Kysely<{ [key: string]: any }>;
  private typeRepo: ContentTypeRepository;

  constructor(inject: ContentItemQueryInjections) {
    this.db = new D1Kysely(inject.db);
    this.typeRepo = new ContentTypeRepository({ db: inject.db });
  }

  async queryContentItems(data: QueryContentItemData) {
    const contentType = await this.typeRepo.findByTableName(data.tableName);
    const schema = contentType?.props.schema;

    if (!schema) throw new Error("invalid_table_name");

    let query = this.db
      .selectFrom(data.tableName)
      .selectAll()
      .offset(data.offset || 0)
      .limit(data.limit || DEFAULT_CONTENT_ITEM_LIMIT);

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

    return query.execute();
  }
}
