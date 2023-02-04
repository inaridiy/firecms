import { CreateTableBuilder, Kysely, sql } from "kysely";
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

    const sideQuery: CreateTableBuilder<string, "id">[] = [];
    let contentTable = this.db.schema
      .createTable(contentType.props.tableName)
      .addColumn("id", "text", (c) => c.primaryKey());

    for (const [key, data] of Object.entries(contentType.props.schema)) {
      if (data.type === "reference-to-many") {
        if (!data.referenceTo)
          throw new Error("Reference to many must have a referenceTo property");

        const { tableName } = contentType.props;
        const sideTableName = [tableName, key, data.referenceTo].join("_");

        const sideTable = this.db.schema
          .createTable(sideTableName)
          .addColumn(tableName + "_id", "text", (c) => c.notNull())
          .addColumn(data.referenceTo + "_id", "text", (c) => c.notNull())
          .addPrimaryKeyConstraint("id", [
            tableName + "_id",
            data.referenceTo + "_id",
          ]);
        sideQuery.push(sideTable);
      } else if (data.type === "reference-to-one") {
        if (!data.referenceTo)
          throw new Error("Reference to one must have a referenceTo property");
        contentTable = contentTable.addColumn(key + "_id", "text", (c) =>
          c.notNull()
        );
      } else {
        contentTable = contentTable.addColumn(key, data.sqlType, (c) => {
          if (data.required) c = c.notNull();
          if (data.unique) c = c.unique();
          return c;
        });
      }
    }

    contentTable = contentTable
      .addColumn("created_at", "text", (c) =>
        c.defaultTo(sql`(DATETIME('now', 'localtime'))`).notNull()
      )
      .addColumn("updated_at", "text", (c) =>
        c.defaultTo(sql`(DATETIME('now', 'localtime'))`).notNull()
      );

    await contentTable.execute(); // TODO: Batch this
    await Promise.all(sideQuery.map((q) => q.execute()));
  }

  async findByTableName(tableName: string) {
    const contentType = await this.db
      .selectFrom("content_types")
      .selectAll()
      .where("table_name", "=", tableName)
      .executeTakeFirst();

    if (!contentType) return undefined;

    return new ContentType({
      id: contentType.id,
      name: contentType.name,
      tableName: contentType.table_name,
      schema: JSON.parse(contentType.schema),
    });
  }
}
