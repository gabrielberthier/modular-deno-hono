import { STATUS_CODE } from "@std/http";
import {
  HttpController,
  HttpResponse,
} from "../../../protocols/presentation.protocols.ts";

export default class HealthCheckController implements HttpController {
  handle(): Promise<HttpResponse<undefined>> {
    return Promise.resolve({
      success: true,
      status: STATUS_CODE.NoContent,
    });
  }
}
