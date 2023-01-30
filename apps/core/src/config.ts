export interface Env {
  DB: D1Database;
}

export interface Database {
  Users: {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
