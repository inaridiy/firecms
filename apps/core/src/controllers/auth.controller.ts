import { Hono } from "hono";
import { validator } from "hono/validator";
import type { HonoConfig } from "../config";
import { AuthService } from "../services/auth.service";

const auth = new Hono<HonoConfig>();

auth.post("/login", async (c) => {
  const authService = new AuthService({
    db: c.env.DB,
    secret: c.env.JWT_SECRET,
  });

  try {
    const { token } = await authService.login((await c.req.json()) as any);
    return c.json({ token });
  } catch (_e) {
    const e = _e as Error;
    console.error(e);
    if (e.message === "invalid_credentials") {
      return c.text("invalid credentials", 401);
    } else {
      return c.text(e.message, 500);
    }
  }
});

export default auth;
