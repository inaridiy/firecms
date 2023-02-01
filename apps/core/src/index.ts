import { Hono } from "hono";
import { logger } from "hono/logger";
import { HonoConfig } from "./config";

import auth from "./controllers/auth.controller";
import user from "./controllers/user.controller";

const app = new Hono<HonoConfig>();

app.use("*", logger());

app.route("/auth", auth);
app.route("/user", user);

app.get("/", (c) => c.text("Hono!!"));
app.all("/teapot", (c) => c.text("I'm a teapot", 418));

export default app;
