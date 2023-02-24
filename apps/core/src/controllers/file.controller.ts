import { Hono } from "hono";
import { cache } from "hono/cache";
import { etag } from "hono/etag";
import { HonoConfig } from "../config";
import { FileObjectQueryService } from "../queries/file.query";
import { FileObjectService } from "../services/file.service";

const file = new Hono<HonoConfig>();

interface PutFileData {
  name?: string;
  body: string;
  metadata?: Record<string, any>;
}

file.put("/", async (c) => {
  const fileObjectService = new FileObjectService({
    db: c.env.DB,
    bucket: c.env.BUCKET,
  });

  const data = await c.req.json<PutFileData>();
  const contentType = data.body.split(";")[0].split(":")[1];
  const file = Uint8Array.from(atob(data.body.split(",")[1]), (c) =>
    c.charCodeAt(0)
  );

  await fileObjectService.upload({
    name: data.name || "file",
    contentType,
    metadata: data.metadata || {},
    file,
  });

  return c.json({ ok: true });
});

file.get("/", async (c) => {
  const fileObjectQueryService = new FileObjectQueryService({ db: c.env.DB });

  const { limit, offset } = c.req.query();
  try {
    const files = await fileObjectQueryService.queryFileObjects({
      type: c.req.query("type"),
      orders: c.req.query("orders"),
      filters: c.req.query("filters"),
      q: c.req.query("q"),
      id: c.req.query("id"),
      ids: c.req.query("ids"),
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
    return c.jsonT(files);
  } catch (_e) {
    const e = _e as Error;
    return c.json({ ok: false, error: e.message }, 500);
  }
});

// TODO: More good cache control
file.get(
  "/:idOrName",
  etag(),
  cache({ cacheName: "file-cache", cacheControl: "max-age=3600" }),
  async (c) => {
    const fileObjectService = new FileObjectService({
      db: c.env.DB,
      bucket: c.env.BUCKET,
    });
    const idOrName = c.req.param("idOrName");
    const file = await fileObjectService.download(idOrName);
    if (!file) return c.notFound();

    return c.body(await file.arrayBuffer(), 200, {
      "Content-Type": file.httpMetadata?.contentType || "",
    });
  }
);

export default file;
