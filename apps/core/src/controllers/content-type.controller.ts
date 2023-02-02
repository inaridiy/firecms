import { Hono } from "hono";
import type { HonoConfig } from "../config";
import { ContentTypeService } from "../services/content-type.service";

const contentType = new Hono<HonoConfig>();

contentType.post("/", async (c) => {
  const contentTypeService = new ContentTypeService({ db: c.env.DB });
  const result = await contentTypeService.createContentType(await c.req.json());
  return c.json(result);
});

export default contentType;
