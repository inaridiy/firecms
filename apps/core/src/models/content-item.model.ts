import { ContentSchema } from "./content-type.model";

export interface ContentItemProps {
  id: string;
  tableName: string;
  schema: ContentSchema;
  data: any;
}

export class ContentItem {
  get props() {
    return this._props;
  }

  constructor(private _props: ContentItemProps) {
    //Todo: validate data
  }

  static create(data: { tableName: string; schema: ContentSchema; data: any }) {
    return new ContentItem({
      id: crypto.randomUUID(),
      tableName: data.tableName,
      schema: data.schema,
      data: data.data,
    });
  }
}
