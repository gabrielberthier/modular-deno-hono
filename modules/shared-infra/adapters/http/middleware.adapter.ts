import { createMiddleware } from "hono/factory";

export const ensureJsonMiddleware = createMiddleware(async (c, next) => {
  if (!/application\/json/gi.test(c.req.header("content-type") ?? "")) {
    return c.json({ message: "This endpoint only receives JSON" }, 400);
  }

  return await next();
});
