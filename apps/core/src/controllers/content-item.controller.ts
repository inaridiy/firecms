import { Hono } from "hono";
import type { HonoConfig } from "../config";
import { ContentItemQueryService } from "../queries/content-item.query";
import { ContentItemService } from "../services/content-item.service";

const contentItem = new Hono<HonoConfig>();

contentItem.post("/:tableName", async (c) => {
  const contentItemService = new ContentItemService({ db: c.env.DB });

  try {
    const result = await contentItemService.createContentItem({
      tableName: c.req.param("tableName"),
      data: await c.req.json(),
    });
    return c.json(result);
  } catch (e) {
    console.log(e);
    return c.json(e, 500);
  }
});

contentItem.get("/:tableName", async (c) => {
  const queryService = new ContentItemQueryService({ db: c.env.DB });

  const [limit, offset] = [c.req.query("limit"), c.req.query("offset")];
  try {
    const result = await queryService.queryContentItems({
      tableName: c.req.param("tableName"),
      ids: c.req.query("ids"),
      q: c.req.query("q"),
      filters: c.req.query("filters"),
      orders: c.req.query("orders"),
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    return c.json(result);
  } catch (e) {
    console.log(e);
    return c.json(e, 500);
  }
});

export default contentItem;
