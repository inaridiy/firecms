import { ContentType, ContentFieldTypes } from "../models/content-type.model";
import { ContentTypeRepository } from "../repositories/content-type.repository";

export interface ContentTypeInjections {
  db: D1Database;
}

export interface CreateContentTypeData {
  name: string;
  tableName: string;
  schema: {
    [key: string]: {
      type: ContentFieldTypes;
      referenceTo: string;
      required?: boolean;
      unique?: boolean;
    };
  };
}

export class ContentTypeService {
  private readonly contentTypeRepo: ContentTypeRepository;

  constructor(inject: ContentTypeInjections) {
    this.contentTypeRepo = new ContentTypeRepository({ db: inject.db });
  }

  async createContentType(data: CreateContentTypeData) {
    const contentType = ContentType.create(data);
    await this.contentTypeRepo.create(contentType);
  }
}
