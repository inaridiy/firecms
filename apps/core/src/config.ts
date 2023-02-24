export interface HonoConfig {
  Bindings: { DB: D1Database; BUCKET: R2Bucket; JWT_SECRET: string };
}
