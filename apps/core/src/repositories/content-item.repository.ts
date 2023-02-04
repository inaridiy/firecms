import { Kysely } from "kysely";
import { ContentItem } from "../models/content-item.model";
import { D1Kysely } from "../database/d1-kysely";

export interface ContentItemRepositoryInjections {
  db: D1Database;
}

export class ContentItemRepository {
  private db: Kysely<{ [key: string]: any }>;

  constructor(inject: ContentItemRepositoryInjections) {
    this.db = new D1Kysely(inject.db);
  }

  async create(contentItem: ContentItem) {
    const insertValuesEntries = Object.entries(contentItem.props.data)
      .map(([key, value]) => {
        const schema = contentItem.props.schema[key];
        if (schema.type === "reference-to-one") {
          return [key + "_id", value];
        } else if (schema.type !== "reference-to-many") {
          return [key, value];
        }
      })
      .filter((v): v is [string, any] => Boolean(v));

    const sideInserts = Object.entries(contentItem.props.data)
      .filter(
        ([key]) => contentItem.props.schema[key].type === "reference-to-many"
      )
      .map(([key, value]: [string, string[]]) => {
        const { tableName } = contentItem.props;
        const schema = contentItem.props.schema[key];
        const sideTableName = [tableName, key, schema.referenceTo].join("_");

        const insertValues = value.map((id) => ({
          [contentItem.props.tableName + "_id"]: contentItem.props.id,
          [schema.referenceTo + "_id"]: id,
        }));
        return this.db.insertInto(sideTableName).values(insertValues).execute();
      });

    await this.db
      .insertInto(contentItem.props.tableName)
      .values({
        id: contentItem.props.id,
        ...Object.fromEntries(insertValuesEntries),
      })
      .execute();
    await Promise.all(sideInserts);
  }
}
