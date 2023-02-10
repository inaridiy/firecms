import { Kysely } from "kysely";
import { D1Kysely, Database } from "../database";
import { parseOrders } from "../utils/parseOrders";
import {
  parseFilters,
  ALLOWED_FILTERS,
  FILTER_SQL_OPERATORS,
} from "../utils/parseFilters";

export interface ApiKeyQueryInjections {
  db: D1Database;
}

interface QueryApiKeyData {
  name?: string;
  filters?: string;
  orders?: string;
  q?: string;
  id?: string;
  ids?: string;
  limit?: number;
  offset?: number;
}

export class ApiKeyQueryService {
  private db: Kysely<Database>;

  constructor(inject: ApiKeyQueryInjections) {
    this.db = new D1Kysely(inject.db);
  }

  async queryAPIKeys(data: QueryApiKeyData) {
    let query = this.db.selectFrom("api_keys");

    if (data.name) query = query.where("name", "=", data.name);
    if (data.id) query = query.where("id", "=", data.id);
    if (data.ids) query = query.where("id", "in", data.ids.split(","));
    if (data.q) {
      for (const colum of ["name", "permissions"] as const)
        query = query.orWhere(colum, "like", `%${data.q}%`);
    }
    if (data.orders) {
      const orders = parseOrders(data.orders);
      for (const order of orders)
        query = query.orderBy(order.field as "name", order.direction);
    }
    if (data.filters) {
      const filters = parseFilters(data.filters, ALLOWED_FILTERS);
      for (const filter of filters) {
        const { field, operator, value } = filter;
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
      .limit(data.limit ?? 100)
      .selectAll();

    return query.execute();
  }
}
