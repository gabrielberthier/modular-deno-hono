import { assertEquals } from "@std/assert";
import app from "../../../../config/app.ts";

Deno.test("Should get user home", async function () {
  const res = await app.request("/users");

  assertEquals(await res.text(), "User Home");
});
