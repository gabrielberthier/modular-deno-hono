import {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
  SuccessStatusCode,
} from "hono/utils/http-status";

export interface SuccessResponse<T> {
  data?: T;
  error?: null;
  status: SuccessStatusCode;
  headers?: Record<string, string>;
}

export interface ErrorResponse {
  data?: null;
  error: Error;
  status: ClientErrorStatusCode | ServerErrorStatusCode;
  headers?: Record<string, string>;
}

export type HttpResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface HttpController<
  T = Record<string | number | symbol, never>,
  R = unknown
> {
  handle: (request: T) => Promise<HttpResponse<R>>;
}
