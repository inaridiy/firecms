import { Hono } from "hono";
import { jwt } from "hono/jwt";

import type { HonoConfig } from "../config";
import { UserService } from "../services/user.service";

const user = new Hono<HonoConfig>();

user.post("/signup", async (c) => {
  const userService = new UserService({
    db: c.env.DB,
    secret: c.env.JWT_SECRET,
  });

  try {
    const { name, email, password } = (await c.req.json()) as any;
    const user = await userService.createUser({ name, email, password });
    return c.json(user);
  } catch (e) {
    console.error(e);
    return c.json(e, 500);
  }
});

user.get(
  "/user/:id",
  jwt({
    secret: JWT_SECRET,
  }),
  async (c) => {}
);

export default user;
