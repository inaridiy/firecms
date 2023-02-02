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
    await this.db
      .insertInto(contentItem.props.tableName)
      .values({ id: contentItem.props.id, ...contentItem.props.data })
      .execute();
  }
}
