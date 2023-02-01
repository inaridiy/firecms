export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

export interface HonoConfig {
  Bindings: Env;
}
