import { Hono } from "hono";
import { HonoConfig } from "../config";
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

export default file;
