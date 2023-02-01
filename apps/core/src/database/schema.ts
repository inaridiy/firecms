import { ColumnType } from "kysely";

export interface Database {
  user_credentials: {
    id: string;
    password_hash: string;
    createdAt: ColumnType<Date, never, never>;
    updatedAt: ColumnType<Date, never, string>;
  };
  user_profile: {
    user_id: string;
    name: string;
    email: string;
    createdAt: ColumnType<Date, never, never>;
    updatedAt: ColumnType<Date, never, string>;
  };
}
