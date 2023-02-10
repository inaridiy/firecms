import { ColumnType } from "kysely";

export interface Database {
  user_credentials: {
    id: string;
    password_hash: string;
    created_at: ColumnType<Date, never, never>;
    updated_at: ColumnType<Date, never, string>;
  };
  user_profile: {
    id: string;
    name: string;
    email: string;
    created_at: ColumnType<Date, never, never>;
    updated_at: ColumnType<Date, never, string>;
  };
  content_types: {
    id: string;
    name: string;
    table_name: string;
    schema: string;
    created_at: ColumnType<Date, never, never>;
    updated_at: ColumnType<Date, never, string>;
  };
  file_objects: {
    id: string;
    name: string | null;
    content_type: string;
    size: number;
    metadata: any;
    created_at: ColumnType<Date, never, never>;
    updated_at: ColumnType<Date, never, string>;
  };
  api_keys: {
    id: string;
    name: string;
    key: string;
    permissions: string;
    created_at: ColumnType<Date, never, never>;
    updated_at: ColumnType<Date, never, string>;
  };
}
