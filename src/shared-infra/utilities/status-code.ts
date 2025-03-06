import {
  ClientErrorStatusCode,
  ContentfulStatusCode,
  ServerErrorStatusCode,
  SuccessStatusCode,
} from "hono/utils/http-status";
import { isClientErrorStatus, isServerErrorStatus } from "@std/http/status";

const contentfulStatusCodes: ContentfulStatusCode[] = [
  200,
  201,
  202,
  203,
  206,
  207,
  208,
  226,
];
const successStatusCodes: SuccessStatusCode[] = [
  200,
  201,
  202,
  203,
  204,
  205,
  206,
  207,
  208,
  226,
];

export const isErrorStatusCode = (
  status: unknown,
): status is ClientErrorStatusCode | ServerErrorStatusCode =>
  typeof status === "number" &&
  (isClientErrorStatus(status) || isServerErrorStatus(status));

export const isSuccessfulStatusCode = (
  status: unknown,
): status is SuccessStatusCode =>
  successStatusCodes.some((el) => el === status);

export const isContentfulStatusCode = (
  status: unknown,
): status is ContentfulStatusCode =>
  contentfulStatusCodes.some((el) => el === status);
