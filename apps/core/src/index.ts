import { Hono } from "hono";
import { logger } from "hono/logger";
import { Env } from "./config";

const app = new Hono<{
  Bindings: Env;
}>();

app.use("*", logger());

app.get("/", (c) => c.text("Hono!!"));
app.all("/teapot", (c) => c.text("I'm a teapot", 418));
app.get("/user", async (c) => {
  const result = await c.env.DB.prepare("SELECT * FROM Users").all();

  return c.json(result);
});
app.get("/user/:id", async (c) => {
  const result = await c.env.DB.prepare("SELECT * FROM Users WHERE id = ?")
    .bind(c.req.param("id"))
    .all();

  return c.json(result);
});

export default app;
