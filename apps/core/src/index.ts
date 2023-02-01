import { Hono } from "hono";
import { logger } from "hono/logger";
import { Env, HonoConfig } from "./config";

const app = new Hono<HonoConfig>();

app.use("*", logger());

app.get("/", (c) => c.text("Hono!!"));
app.all("/teapot", (c) => c.text("I'm a teapot", 418));

export default app;
