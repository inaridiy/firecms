import { Hono } from "hono";
import type { HonoConfig } from "../config";
import { UserService } from "../services/user.service";
import { UserQueryService } from "../queries/user.query";

const user = new Hono<HonoConfig>();

user.post("/", async (c) => {
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

user.get("/:name", async (c) => {
  const userQueryService = new UserQueryService({ db: c.env.DB });

  try {
    const users = await userQueryService.queryUsers({
      name: c.req.param("name"),
    });
    return c.json(users[0]);
  } catch (e) {
    console.error(e);
    return c.json(e, 500);
  }
});

user.get("/", async (c) => {
  const userQueryService = new UserQueryService({ db: c.env.DB });

  const [limit] = [c.req.query("limit")]; // Experimental Writing
  try {
    const users = await userQueryService.queryUsers({
      email: c.req.query("email"),
      name: c.req.query("name"),
      id: c.req.query("id"),
      limit: limit ? Number(limit) : undefined,
    });

    return c.json(users);
  } catch (e) {
    console.error(e);
    return c.json(e, 500);
  }
});

export default user;
