import { Kysely } from "kysely";
import { D1Kysely } from "../database/d1-kysely";
import { Database } from "../database/schema";
import {
  parseFilters,
  ALLOWED_FILTERS,
  FILTER_SQL_OPERATORS,
} from "../utils/parseFilters";
import { parseOrders } from "../utils/parseOrders";

export interface FileObjectQueryInjections {
  db: D1Database;
}

interface QueryFileObjectData {
  filters?: string;
  orders?: string;
  type?: string;
  q?: string;
  id?: string;
  ids?: string;
  limit?: number;
  offset?: number;
}

const FILE_COLUMN = [
  "id",
  "content_type",
  "name",
  "size",
  "created_at",
  "updated_at",
];

const DEFAULT_FILE_OBJECT_QUERY_LIMIT = 100;

export class FileObjectQueryService {
  private db: Kysely<Database>;

  constructor(inject: FileObjectQueryInjections) {
    this.db = new D1Kysely(inject.db);
  }

  queryFileObjects(data: QueryFileObjectData) {
    let query = this.db.selectFrom("file_objects").selectAll();

    if (data.type) query = query.where("content_type", "=", data.type);
    if (data.id) query = query.where("id", "=", data.id);
    if (data.ids) query = query.where("id", "in", data.ids.split(","));
    if (data.q) {
      for (const column of ["content_type", "name"] as const)
        query = query.orWhere(column, "like", `%${data.q}%`);
    }
    if (data.orders) {
      const orders = parseOrders(data.orders);
      for (const order of orders)
        query = query.orderBy(order.field as "size", order.direction);
    }
    if (data.filters) {
      const filters = parseFilters(data.filters, ALLOWED_FILTERS);
      for (const filter of filters) {
        const { field, operator, value } = filter;
        if (!FILE_COLUMN.includes(field)) throw new Error("invalid_field");
        if (operator === "contain")
          query = query.where(field as any, "like", `%${value}%`);
        else
          query = query.where(
            field as any,
            FILTER_SQL_OPERATORS[operator],
            value
          );
      }
    }

    query = query
      .offset(data.offset ?? 0)
      .limit(data.limit ?? DEFAULT_FILE_OBJECT_QUERY_LIMIT);

    return query.execute();
  }
}
