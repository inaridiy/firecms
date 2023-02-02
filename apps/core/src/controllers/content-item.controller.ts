import { Hono } from "hono";
import type { HonoConfig } from "../config";
import { ContentItemService } from "../services/content-item.service";

const contentItem = new Hono<HonoConfig>();

contentItem.post("/:tableName", async (c) => {
  const contentItemService = new ContentItemService({ db: c.env.DB });
  const result = await contentItemService.createContentItem({
    tableName: c.req.param("tableName"),
    data: await c.req.json(),
  });
  return c.json(result);
});

export default contentItem;
