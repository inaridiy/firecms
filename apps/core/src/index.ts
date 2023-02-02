import { Hono } from "hono";
import { logger } from "hono/logger";
import { HonoConfig } from "./config";

import auth from "./controllers/auth.controller";
import user from "./controllers/user.controller";
import contentType from "./controllers/content-type.controller";

const app = new Hono<HonoConfig>();

app.use("*", logger());

app.route("/auth", auth);
app.route("/users", user);
app.route("/contents", contentType);

app.get("/", (c) => c.text("Hono!!"));
app.all("/teapot", (c) => c.text("I'm a teapot", 418));

export default app;
