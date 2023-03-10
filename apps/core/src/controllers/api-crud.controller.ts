import { Hono } from "hono";
import { HonoConfig } from "../config";
import { ApiCrudService } from "../services/api-crud.service";

const apiCrud = new Hono<HonoConfig>();

apiCrud.get("/:id", async (c) => {
  const apiCrudService = new ApiCrudService({ db: c.env.DB });

  const [apiKey, tableName] = [c.req.header("X-API-Key"), c.req.param("id")];
  const { limit, offset } = c.req.query();
  try {
    if (!apiKey) throw new Error("Missing X-API-Key header");
    const contentItems = await apiCrudService.queryContentItem({
      apiKey,
      tableName,
      query: {
        ids: c.req.query("ids"),
        q: c.req.query("q"),
        filters: c.req.query("filters"),
        orders: c.req.query("orders"),
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
      },
    });

    return c.jsonT(contentItems);
  } catch (_e) {
    const e = _e as Error;
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});

apiCrud.post("/:id", async (c) => {
  const apiCrudService = new ApiCrudService({ db: c.env.DB });

  const [apiKey, tableName] = [c.req.header("X-API-Key"), c.req.param("id")];
  try {
    if (!apiKey) throw new Error("Missing X-API-Key header");
    const contentItem = await apiCrudService.createContentItem({
      apiKey,
      tableName,
      data: await c.req.json(),
    });
    return c.jsonT(contentItem);
  } catch (_e) {
    const e = _e as Error;
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});

export default apiCrud;
