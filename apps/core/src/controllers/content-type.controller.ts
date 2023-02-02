import { Hono } from "hono";
import type { HonoConfig } from "../config";
import { ContentTypeQueryService } from "../queries/content-type.query";
import { ContentTypeService } from "../services/content-type.service";

const contentType = new Hono<HonoConfig>();

contentType.get("/:tableName", async (c) => {
  const contentTypeQueryService = new ContentTypeQueryService({ db: c.env.DB });
  try {
    const contentType = await contentTypeQueryService.queryContentTypes({
      tableName: c.req.param("tableName"),
    });
    return c.json(contentType[0]);
  } catch (e) {
    console.log(e);
    return c.json(e, 500);
  }
});

contentType.get("/", async (c) => {
  const contentTypeQueryService = new ContentTypeQueryService({ db: c.env.DB });

  const [limit] = [c.req.query("limit")]; // Experimental Writing
  try {
    const contentTypes = await contentTypeQueryService.queryContentTypes({
      name: c.req.query("name"),
      tableName: c.req.query("tableName"),
      id: c.req.query("id"),
      limit: limit ? Number(limit) : undefined,
    });
    return c.json(contentTypes);
  } catch (e) {
    console.log(e);
    return c.json(e, 500);
  }
});

contentType.post("/", async (c) => {
  const contentTypeService = new ContentTypeService({ db: c.env.DB });
  const result = await contentTypeService.createContentType(await c.req.json());
  return c.json(result);
});

export default contentType;
