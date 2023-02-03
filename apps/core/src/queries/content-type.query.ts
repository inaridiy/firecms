import { Kysely } from "kysely";
import { D1Kysely } from "../database/d1-kysely";
import { Database } from "../database/schema";

export interface ContentTypeQueryInjections {
  db: D1Database;
}

interface QueryContentTypeData {
  name?: string;
  tableName?: string;
  q?: string;
  id?: string;
  ids?: string;
  limit?: number;
  offset?: number;
}

const DEFAULT_CONTENT_TYPE_LIMIT = 10;

export class ContentTypeQueryService {
  private db: Kysely<Database>;

  constructor(inject: ContentTypeQueryInjections) {
    this.db = new D1Kysely(inject.db);
  }

  queryContentTypes(data: QueryContentTypeData) {
    let query = this.db.selectFrom("content_types").selectAll();

    if (data.name) query = query.where("name", "=", data.name);
    if (data.tableName) query = query.where("table_name", "=", data.tableName);
    if (data.id) query = query.where("id", "=", data.id);
    if (data.ids) query = query.where("id", "in", data.ids.split(","));
    if (data.q) {
      for (const column of ["name", "table_name"] as const)
        query = query.orWhere(column, "like", `%${data.q}%`);
    }

    query = query
      .offset(data.offset ?? 0)
      .limit(data.limit ?? DEFAULT_CONTENT_TYPE_LIMIT);

    return query.execute();
  }
}
