import { Hono } from "hono";
import type { HonoConfig } from "../config";

const auth = new Hono<HonoConfig>();

export default auth;
