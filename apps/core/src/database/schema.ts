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
}
