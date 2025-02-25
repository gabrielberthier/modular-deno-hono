import {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
  SuccessStatusCode,
} from "hono/utils/http-status";

export interface SuccessResponse<T> {
  success: true;
  data?: T;
  error?: null;
  status: SuccessStatusCode;
  headers?: Record<string, string>;
}

export interface ErrorResponse {
  success: false;
  data?: object;
  error: Error;
  status: ClientErrorStatusCode | ServerErrorStatusCode;
  headers?: Record<string, string>;
}

export type HttpResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface HttpController<
  R = unknown,
  T = Record<string | number | symbol, never>,
> {
  handle: (request: T) => Promise<HttpResponse<R>>;
}
