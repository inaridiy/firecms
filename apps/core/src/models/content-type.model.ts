export interface ContentTypeProps {
  id: string;
  name: string;
  tableName: string;
  schema: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ContentType {
  get props() {
    return this._props;
  }

  constructor(private _props: ContentTypeProps) {}

  static create(data: ContentTypeProps) {
    return new ContentType(data);
  }
}
