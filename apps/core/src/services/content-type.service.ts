import { ContentTypeRepository } from "../repositories/content-type.repository";

export interface ContentTypeInjections {
  db: D1Database;
}

export class ContentTypeService {
  private readonly contentTypeRepo: ContentTypeRepository;

  constructor(inject: ContentTypeInjections) {
    this.contentTypeRepo = new ContentTypeRepository({ db: inject.db });
  }
}
