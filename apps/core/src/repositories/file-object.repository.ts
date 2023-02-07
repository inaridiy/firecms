import { Kysely } from "kysely";
import { D1Kysely } from "../database/d1-kysely";
import { Database } from "../database/schema";
import { FileObject } from "../models/file-object.model";

export interface FileObjectRepositoryInjections {
  db: D1Database;
}

export class FileObjectRepository {
  private db: Kysely<Database>;

  constructor(inject: FileObjectRepositoryInjections) {
    this.db = new D1Kysely(inject.db);
  }

  async create(fileObject: FileObject) {
    await this.db
      .insertInto("file_objects")
      .values({
        id: fileObject.props.id,
        name: fileObject.props.name || null,
        content_type: fileObject.props.contentType,
        size: fileObject.props.size,
        metadata: JSON.stringify(fileObject.props.metadata),
      })
      .execute();
  }
}
