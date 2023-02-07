import { FileObjectRepository } from "../repositories/file-object.repository";
import { FileObject } from "../models/file-object.model";

export interface FileObjectServiceInjections {
  db: D1Database;
  bucket: R2Bucket;
}

export interface UploadFileObjectData {
  name: string;
  contentType: string;
  metadata: Record<string, any>;
  file: Uint8Array;
}

export class FileObjectService {
  private readonly fileObjectRepo: FileObjectRepository;
  private readonly bucket: R2Bucket;

  constructor(inject: FileObjectServiceInjections) {
    this.fileObjectRepo = new FileObjectRepository({ db: inject.db });
    this.bucket = inject.bucket;
  }

  async upload(data: UploadFileObjectData) {
    const fileObject = FileObject.create({
      name: data.name,
      contentType: data.contentType,
      size: data.file.length,
      metadata: data.metadata,
    });

    await Promise.all([
      this.fileObjectRepo.create(fileObject),
      this.bucket.put(fileObject.props.id, data.file, {
        httpMetadata: { contentType: data.contentType },
      }),
    ]);
  }
}
