import { Kysely } from "kysely";
import { D1Kysely } from "../database/d1-kysely";
import { Database } from "../database/schema";
import { ContentType } from "../models/content-type.model";

export interface ContentTypeRepositoryInjections {
  db: D1Database;
}

export class ContentTypeRepository {
  private db: Kysely<Database>;

  constructor(inject: ContentTypeRepositoryInjections) {
    this.db = new D1Kysely(inject.db);
  }

  create(contentType: ContentType) {
    return this.db.insertInto("content_types").values({
      id: contentType.props.id,
      name: contentType.props.name,
      table_name: contentType.props.tableName,
      schema: JSON.stringify(contentType.props.schema),
    });
  }
}
