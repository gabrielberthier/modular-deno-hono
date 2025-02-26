// routes/userRoutes.ts
import { Hono } from "hono";
import { ControllerAdapter } from "../../../shared-infra/adapters/http/controller.adapter.ts";
import HealthCheckController from "../controllers/add-user.controller.ts";
import { describeRoute } from "hono-openapi";
import { validator } from "hono/validator";
import { schema } from "../schemas/user.schema.ts";
import { ensureJsonMiddleware } from "../../../shared-infra/adapters/http/middleware.adapter.ts";
import { createAddUser } from "../../infra/factories/add-user.factory.ts";
import { Buffer } from "node:buffer";
import { createWriteStream, mkdirSync, stat } from "node:fs";
import { cwd } from "node:process";
import { dirname, join } from "node:path";
import { exists } from "https://deno.land/std/fs/mod.ts";

export const userRoutes = new Hono();

const adapter = new ControllerAdapter();

userRoutes.get("/", (c) => c.text("User Home"));
userRoutes.get("/profile", (c) => c.json({ name: "John Doe" }));
userRoutes.get("/profile/:id", (c) => c.json({ name: c.req.param("id") }));
userRoutes.post(
  "/",
  describeRoute({
    description: "Say hello to the user",
    responses: {
      201: {
        description: "Successful response",
        content: {
          "text/json": { schema },
        },
      },
      400: {
        description: "Invalid response",
        content: {
          "text/json": {
            error: {
              message: "User already exists",
            },
          },
        },
      },
      422: {
        description: "Invalid response",
        content: {
          "text/json": "Invalid JSON",
        },
      },
      500: {
        description: "Server Error",
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
      return c.json(
        {
          message: "Invalid JSON",
          errors: parsed.error.errors,
        },
        422
      );
    }
    return parsed.data;
  }),
  adapter.adapt(new HealthCheckController(createAddUser()))
);

userRoutes.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const files = body.image;

  // check if files is an array and has length
  if (!files || (Array.isArray(files) && files.length === 0)) {
    return c.json({ message: "No files uploaded" }, 400);
  }

  // if files is not an array, convert it to an array
  const fileArray = Array.isArray(files) ? files : [files];

  const processedFiles = await Promise.all(
    fileArray.map(async (file) => {
      if (!(file instanceof File)) {
        return c.json(
          {
            message: "Invalid file type",
            error: "Expected a file upload but received something else",
            received: typeof file,
          },
          400
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const path = join(cwd(), "/uploads", file.name);
      const dir = dirname(path);
      stat(dir, function (err) {
        if (err?.code === "ENOENT") {
          mkdirSync(dir);
        }
        createWriteStream(path).write(buffer);
      });

      return {
        name: file.name,
        size: file.size,
        type: file.type,
      };
    })
  );

  return c.json({ message: "Image uploaded", files: processedFiles }, 200);
});

userRoutes.post("/upload2", async (c) => {
  const body = await c.req.parseBody();
  const files = body.image;

  // check if files is an array and has length
  if (!files || (Array.isArray(files) && files.length === 0)) {
    return c.json({ message: "No files uploaded" }, 400);
  }

  // if files is not an array, convert it to an array
  const fileArray = Array.isArray(files) ? files : [files];

  const processedFiles = await Promise.all(
    fileArray.map(async (file) => {
      if (!(file instanceof File)) {
        return c.json(
          {
            message: "Invalid file type",
            error: "Expected a file upload but received something else",
            received: typeof file,
          },
          400
        );
      }

      const path = join(cwd(), "/uploads2", file.name);
      const dir = dirname(path);

      if (await exists(path)) {
        return c.json(
          {
            message: "File already exists",
          },
          200
        );
      }

      try {
        await Deno.lstat(dir);
      } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
          throw err;
        }
        await Deno.mkdir(dir);
      }

      const uploadedFile = await Deno.open(path, {
        createNew: true,
        write: true,
        create: true,
      });

      // System automatically closes the file
      await file.stream().pipeTo(uploadedFile.writable);

      return {
        name: file.name,
        size: file.size,
        type: file.type,
      };
    })
  );

  return c.json({ message: "Image uploaded", files: processedFiles }, 200);
});
