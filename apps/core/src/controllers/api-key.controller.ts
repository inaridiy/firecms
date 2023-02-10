import { Hono } from "hono";
import { HonoConfig } from "../config";
import { ApiKeyQueryService } from "../queries/api-key.query";
import { APIKeyService } from "../services/api-key.service";

const apiKey = new Hono<HonoConfig>();

apiKey.post("/", async (c) => {
  const apiKeyService = new APIKeyService({ db: c.env.DB });
  try {
    const result = apiKeyService.createAPIKey(await c.req.json());

    return c.json(result);
  } catch (_e) {
    const e = _e as Error;
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});

apiKey.get("/", async (c) => {
  const apiKeyQueryService = new ApiKeyQueryService({ db: c.env.DB });
  const [limit, offset] = [c.req.param("limit"), c.req.param("offset")];
  try {
    const apiKeys = await apiKeyQueryService.queryAPIKeys({
      name: c.req.query("name"),
      orders: c.req.query("orders"),
      filters: c.req.query("filters"),
      q: c.req.query("q"),
      id: c.req.query("id"),
      ids: c.req.query("ids"),
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
    return c.json(apiKeys);
  } catch (_e) {
    const e = _e as Error;
    return c.json({ ok: false, error: e.message }, 500);
  }
});

export default apiKey;
