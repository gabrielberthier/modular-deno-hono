// routes/userRoutes.ts
import { Hono } from "hono";
import { ControllerAdapter } from "../../../shared-infra/adapters/http/controller.adapter.ts";
import HealthCheckController from "../controllers/add-user.controller.ts";
import { describeRoute } from "hono-openapi";
import { validator } from "hono/validator";
import { schema } from "../schemas/user.schema.ts";
import { ensureJsonMiddleware } from "../../../shared-infra/adapters/http/middleware.adapter.ts";

export const userRoutes = new Hono();

const adapter = new ControllerAdapter();

userRoutes.get("/", (c) => c.text("User Home"));
userRoutes.get("/profile", (c) => c.json({ name: "John Doe" }));
userRoutes.get(
  "/love-of-my-life",
  describeRoute({
    description: "Say Hello to Love of My Life",
    responses: {
      200: {
        description: "Successful response",
      },
    },
  }),
  (c) => c.json("Hello, love of my life!"),
);
userRoutes.get("/profile/:id", (c) => c.json({ name: c.req.param("id") }));
userRoutes.post(
  "/",
  describeRoute({
    description: "Say hello to the user",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "text/json": { schema },
        },
      },
      422: {
        description: "Successful response",
        content: {
          "text/json": "Invalid JSON",
        },
      },
    },
  }),
  ensureJsonMiddleware,
  validator("json", (value, c) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return c.json({
        message: "Invalid JSON",
        errors: parsed.error.errors,
      }, 422);
    }
    return parsed.data;
  }),
  adapter.adapt(new HealthCheckController()),
);
