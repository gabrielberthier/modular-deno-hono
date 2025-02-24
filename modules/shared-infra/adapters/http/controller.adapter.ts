import { Context, TypedResponse } from "hono";
import { HttpController } from "../../../protocols/presentation.protocols.ts";
import { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";

export interface HonoSuccessResponse {
  success: true;
  data: object;
  error?: null;
}

export interface HonoErrorResponse {
  success: false;
  data?: object;
  error: Error;
}

export type HonoHttpResponse = HonoSuccessResponse | HonoErrorResponse;

export class ControllerAdapter {
  adapt(
    controller: HttpController
  ): (
    c: Context
  ) => Promise<Response | TypedResponse<HonoHttpResponse, StatusCode>> {
    return async (
      c: Context
    ): Promise<
      Response | TypedResponse<HonoHttpResponse, StatusCode>
    > => {
      const body = /application\/json/gi.test(
        c.req.header("content-type") ?? ""
      )
        ? await c.req.json()
        : {};

      const request = {
        ...{ ...body },
        ...(c.req.param() || {}),
      };

      const httpResponse = await controller.handle(request);

      if (httpResponse.success) {
        const { data, status, headers } = httpResponse;
        const contentfulStatusCode: ContentfulStatusCode[] = [
          200, 201, 202, 203, 206, 207, 208, 226,
        ];
        const isContentfulStatusCode = (
          status: unknown
        ): status is ContentfulStatusCode =>
          contentfulStatusCode.some((el) => el === status);
        if (data && isContentfulStatusCode(status)) {
          const responseData =
            typeof data === "object" && data !== null
              ? data
              : { message: data };
          const successResponse: HonoSuccessResponse = {
            success: true,
            data: responseData,
          };

          return c.json(successResponse, {
            status,
            headers,
          });
        }

        return c.newResponse(null, status, headers);
      }

      const adapterError: Error & { message: string } = {
        ...httpResponse.error,
        message: httpResponse.error.message,
      };

      const errorResponse: HonoErrorResponse = {
        success: false,
        error: adapterError,
      };

      console.error(httpResponse.error);

      return c.json(errorResponse, {
        status: httpResponse.status,
        headers: httpResponse.headers,
      });
    };
  }
}
