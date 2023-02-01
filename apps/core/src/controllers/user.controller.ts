import { Hono } from "hono";
import type { HonoConfig } from "../config";

const user = new Hono<HonoConfig>();

export default user;
