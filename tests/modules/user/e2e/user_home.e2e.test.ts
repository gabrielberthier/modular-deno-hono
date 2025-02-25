import { assertEquals } from "@std/assert";
import app from "../../../../modules/shared-infra/application/app.ts";

Deno.test("Should get user home", async function () {
  const res = await app.request("/users");

  assertEquals(await res.text(), "User Home");
});
