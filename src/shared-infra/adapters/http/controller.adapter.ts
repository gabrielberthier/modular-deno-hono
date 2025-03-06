import { Context, TypedResponse } from "hono";
import { HttpController } from "../../../protocols/presentation.protocols.ts";
import { StatusCode } from "hono/utils/http-status";
import {
  isContentfulStatusCode,
  isErrorStatusCode,
  isSuccessfulStatusCode,
} from "../../utilities/status-code.ts";

export interface HonoSuccessResponse {
  data: object;
  error?: null;
}

export interface HonoErrorResponse {
  data?: object;
  error: Error;
}

export type HonoHttpResponse = HonoSuccessResponse | HonoErrorResponse;

export class ControllerAdapter {
  adapt<T>(
    controller: HttpController<T>,
  ): (
    c: Context,
  ) => Promise<Response | TypedResponse<HonoHttpResponse, StatusCode>> {
    return async (
      c: Context,
    ): Promise<Response | TypedResponse<HonoHttpResponse, StatusCode>> => {
      const body = /application\/json/gi.test(
          c.req.header("content-type") ?? "",
        )
        ? await c.req.json()
        : {};

      const request = {
        ...{ ...body },
        ...(c.req.param() || {}),
      };

      const httpResponse = await controller.handle(request);

      if (isSuccessfulStatusCode(httpResponse.status)) {
        const { data, status, headers } = httpResponse;

        if (data && isContentfulStatusCode(status)) {
          const responseData = typeof data === "object" && data !== null
            ? data
            : { message: data };
          const successResponse: HonoSuccessResponse = {
            data: responseData,
          };

          return c.json(successResponse, {
            status,
            headers,
          });
        }

        return c.newResponse(null, status, headers);
      } else if (isErrorStatusCode(httpResponse.status) && httpResponse.error) {
        const adapterError: Error & { message: string } = {
          ...httpResponse.error,
          message: httpResponse.error.message,
        };

        const errorResponse: HonoErrorResponse = {
          error: adapterError,
        };

        console.error(httpResponse.error);

        return c.json(errorResponse, {
          status: httpResponse.status,
          headers: httpResponse.headers,
        });
      }

      throw new Error("Bad Status Code");
    };
  }
}
