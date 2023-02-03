import { ColumnType } from "kysely";

export interface Database {
  user_credentials: {
    id: string;
    password_hash: string;
    created_at: ColumnType<Date, never, never>;
    updated_at: ColumnType<Date, never, string>;
  };
  user_profile: {
    user_id: string;
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
}
