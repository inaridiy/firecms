export type ContentFieldTypes =
  | "string"
  | "int"
  | "float"
  | "boolean"
  | "date"
  | "markdown"
  | "json"
  | "reference-to-one"
  | "reference-to-many";

export type ContentSchema = {
  [key: string]: {
    name?: string;
    type: ContentFieldTypes;
    referenceTo?: string;
    sqlType: "text" | "integer" | "real";
    required?: boolean;
    unique?: boolean;
  };
};

export interface ContentTypeProps {
  id: string;
  name: string;
  tableName: string;
  schema: ContentSchema;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateContentTypeData {
  name: string;
  tableName: string;
  schema: {
    [key: string]: {
      type: ContentFieldTypes;
      referenceTo?: string;
      required?: boolean;
      unique?: boolean;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export class ContentType {
  get props() {
    return this._props;
  }

  constructor(private _props: ContentTypeProps) {}

  static create(data: CreateContentTypeData) {
    const { name, tableName, schema } = data;
    const formattedSchema = Object.entries(schema).map(([key, value]) => [
      key,
      {
        ...value,
        sqlType:
          value.type === "int"
            ? "integer"
            : value.type === "float"
            ? "real"
            : "text",
      },
    ]);

    return new ContentType({
      id: crypto.randomUUID(),
      name,
      tableName,
      schema: Object.fromEntries(formattedSchema),
    });
  }
}
