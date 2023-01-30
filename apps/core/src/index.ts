import { Hono } from "hono";
import { logger } from "hono/logger";
import { Env } from "./config";
import { D1Kysely } from "./database/d1-kysely";

const app = new Hono<{
  Bindings: Env;
}>();

app.use("*", logger());

app.get("/", (c) => c.text("Hono!!"));
app.all("/teapot", (c) => c.text("I'm a teapot", 418));

export default app;
