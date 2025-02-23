// routes/userRoutes.ts
import { Hono } from "hono";
import { ControllerAdapter } from "../../../protocols/adapters/controller.adapter.ts";
import HealthCheckController from "../controllers/add-user.controller.ts";
import { describeRoute } from "hono-openapi";
import { validator } from "hono/validator";
import { schema } from "../schemas/user.schema.ts";
import { z } from "zod";

export const userRoutes = new Hono();

const adapter = new ControllerAdapter();

const responseSchema = z.string();

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
  (c) => c.json("Hello, love of my life!")
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
          "text/plain": { schema },
        },
      },
    },
  }),
  validator("json", (value, c) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return c.text("Invalid!", 401);
    }
    return parsed.data;
  }),
  adapter.adapt(new HealthCheckController())
);
