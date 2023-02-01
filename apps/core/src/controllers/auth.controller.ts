import { Hono } from "hono";
import type { HonoConfig } from "../config";

const auth = new Hono<HonoConfig>();

auth.post("/login", (c) => {});

export default auth;
