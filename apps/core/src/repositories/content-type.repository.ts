import { Kysely, sql } from "kysely";
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

  async create(contentType: ContentType) {
    await this.db
      .insertInto("content_types")
      .values({
        id: contentType.props.id,
        name: contentType.props.name,
        table_name: contentType.props.tableName,
        schema: JSON.stringify(contentType.props.schema),
      })
      .execute();

    let contentTable = this.db.schema
      .createTable(contentType.props.tableName)
      .addColumn("id", "text", (c) => c.primaryKey())
      .addColumn("created_at", "text", (c) =>
        c.defaultTo(sql`(DATETIME('now', 'localtime'))`).notNull()
      )
      .addColumn("updated_at", "text", (c) =>
        c.defaultTo(sql`(DATETIME('now', 'localtime'))`).notNull()
      );

    for (const [key, data] of Object.entries(contentType.props.schema)) {
      contentTable = contentTable.addColumn(key, data.sqlType, (c) => {
        if (data.required) c = c.notNull();
        if (data.unique) c = c.unique();
        return c;
      });
    }

    await contentTable.execute();
  }
}
