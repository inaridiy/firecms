import { Context } from "hono";
import { Jwt } from "hono/utils/jwt";

export const parseJwtPayload = <T = unknown, U = unknown>(ctx: Context<any>): {
    payload: T;
    header: U;
} => {
    const token = ctx.req.headers.get("authorization")?.split(/\s+/)[1];
    if (!token)
        throw new Error("No Token found");

    const data = Jwt.decode(token);
    return data as {
        payload: T;
        header: U;
    };
}