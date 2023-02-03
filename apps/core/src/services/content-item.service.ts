import { ContentItem } from "../models/content-item.model";
import { ContentItemRepository } from "../repositories/content-item.repository";
import { ContentTypeRepository } from "../repositories/content-type.repository";

export interface ContentItemServiceInjections {
  db: D1Database;
}

export interface CreateItemData {
  tableName: string;
  data: any;
}

export class ContentItemService {
  private readonly contentTypeRepo: ContentTypeRepository;
  private readonly contentItemRepo: ContentItemRepository;

  constructor(inject: ContentItemServiceInjections) {
    this.contentTypeRepo = new ContentTypeRepository({ db: inject.db });
    this.contentItemRepo = new ContentItemRepository({ db: inject.db });
  }

  async createContentItem(data: CreateItemData) {
    const contentType = await this.contentTypeRepo.findByTableName(
      data.tableName
    );
    if (!contentType) throw new Error("content_type_not_found");

    const contentItem = ContentItem.create({
      tableName: contentType.props.tableName,
      schema: contentType.props.schema,
      data: data.data,
    });

    await this.contentItemRepo.create(contentItem);

    return contentItem.props.data;
  }
}
