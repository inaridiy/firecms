import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { HonoConfig } from "./config";

import apiCrud from "./controllers/api-crud.controller";
import apiKey from "./controllers/api-key.controller";
import auth from "./controllers/auth.controller";
import contentItem from "./controllers/content-item.controller";
import contentType from "./controllers/content-type.controller";
import file from "./controllers/file.controller";
import user from "./controllers/user.controller";

const app = new Hono<HonoConfig>();

app.use("*", logger());
app.use("*", cors());

app.route("/auth", auth);
app.route("/users", user);
app.route("/files", file);
app.route("/api-keys", apiKey);
app.route("/content-types", contentType);
app.route("/contents", contentItem);
app.route("/api", apiCrud);

app.get("/", (c) => c.text("Hono!!"));
app.all("/teapot", (c) => c.text("I'm a teapot", 418));

export default app;

export type CoreEndpoint = typeof app;
