import { Kysely } from "kysely";
import { D1Kysely } from "../database/d1-kysely";
import { Database } from "../database/schema";

export interface ContentTypeQueryInjections {
  db: D1Database;
}

interface QueryContentTypeData {
  name?: string;
  tableName?: string;
  id?: string;
  limit?: number;
}

const DEFAULT_CONTENT_TYPE_LIMIT = 10;

export class ContentTypeQueryService {
  private db: Kysely<Database>;

  constructor(inject: ContentTypeQueryInjections) {
    this.db = new D1Kysely(inject.db);
  }

  queryContentTypes(data: QueryContentTypeData) {
    let query = this.db
      .selectFrom("content_types")
      .selectAll()
      .limit(data.limit || DEFAULT_CONTENT_TYPE_LIMIT);

    if (data.name) query = query.where("name", "=", data.name);
    if (data.tableName) query = query.where("table_name", "=", data.tableName);
    if (data.id) query = query.where("id", "=", data.id);

    return query.execute();
  }
}
