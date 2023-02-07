export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  JWT_SECRET: string;
}

export interface HonoConfig {
  Bindings: Env;
}
