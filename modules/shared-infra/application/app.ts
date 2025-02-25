import { cors } from "hono/cors";
import { userRoutes } from "../../user/presentation/routes/userRoutes.ts";
import { logger } from "hono/logger";
import process from "node:process";
import { requestId } from "hono/request-id";
import { Context, Hono, Next } from "hono";

const app = new Hono();

// Cors setup
app.use("*", cors());
app.use("*", requestId());

// Logger
export const customLogger = (
  c: Context,
  next: Next,
): Promise<Response | void> => {
  return Promise.resolve(
    logger((...str) => console.log(...str, { traceId: c.var.requestId }))(
      c,
      next,
    ),
  );
};
app.use(customLogger);
// Your own routes here
app.route("/users", userRoutes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/health", (c) => {
  return c.json({ status: "ok", uptime: process.uptime() });
});

export default app;
