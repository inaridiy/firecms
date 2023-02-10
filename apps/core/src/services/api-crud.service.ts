import {
  ContentItemQueryService,
  QueryContentItemData,
} from "../queries/content-item.query";
import { APIKeyRepository } from "../repositories/api-key.repository";
import { ContentItemRepository } from "../repositories/content-item.repository";
import { ContentTypeRepository } from "../repositories/content-type.repository";
import { ContentItem } from "../models/content-item.model";

export interface ApiCrudServiceInjections {
  db: D1Database;
}

export interface CreateItemData {
  apiKey: string;
  tableName: string;
  data: any;
}

export interface QueryItemData {
  apiKey: string;
  tableName: string;
  query: Omit<QueryContentItemData, "tableName">;
}

/** 
APIを通したCRUDを行うサービス
置き場所は要件等
**/
export class ApiCrudService {
  private apiKeyRepo: APIKeyRepository;
  private contentTypeRepo: ContentTypeRepository;
  private contentItemQuery: ContentItemQueryService;
  private contentItemRepo: ContentItemRepository;

  constructor(inject: ApiCrudServiceInjections) {
    this.apiKeyRepo = new APIKeyRepository({ db: inject.db });
    this.contentTypeRepo = new ContentTypeRepository({ db: inject.db });
    this.contentItemQuery = new ContentItemQueryService({ db: inject.db });
    this.contentItemRepo = new ContentItemRepository({ db: inject.db });
  }

  async createContentItem(data: CreateItemData) {
    const [apiKey, contentType] = await Promise.all([
      this.apiKeyRepo.findByKey(data.apiKey),
      this.contentTypeRepo.findByTableName(data.tableName),
    ]);

    if (!apiKey) throw new Error("key_not_found");
    if (!apiKey.hasPermission(data.tableName, "create"))
      throw new Error("permission_denied");

    if (!contentType) throw new Error("content_type_not_found");

    const contentItem = ContentItem.create({
      tableName: contentType.props.tableName,
      schema: contentType.props.schema,
      data: data.data,
    });

    await this.contentItemRepo.create(contentItem);

    return contentItem.props.data;
  }

  async queryContentItem(data: QueryItemData) {
    const apiKey = await this.apiKeyRepo.findByKey(data.apiKey);

    if (!apiKey) throw new Error("key_not_found");
    if (!apiKey.hasPermission(data.tableName, "read"))
      throw new Error("permission_denied");

    const contentItems = await this.contentItemQuery.queryContentItems({
      tableName: data.tableName,
      ...data.query,
    });

    return contentItems;
  }
}
