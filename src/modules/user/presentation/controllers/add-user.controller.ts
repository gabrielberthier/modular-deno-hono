import { STATUS_CODE } from "@std/http";
import {
  HttpController,
  HttpResponse,
} from "../../../../protocols/presentation.protocols.ts";
import { AddUserUseCase } from "../../domain/usecases/add-user.usecase.ts";

export default class AddUserController implements
  HttpController<{
    username: string;
    email: string;
  }> {
  constructor(private readonly usecase: AddUserUseCase) {}

  async handle(req: {
    username: string;
    email: string;
  }): Promise<HttpResponse<undefined>> {
    const response = await this.usecase.execute(req);

    if (response.error) {
      return {
        error: response.error,
        status: STATUS_CODE.BadRequest,
      };
    }

    return {
      status: STATUS_CODE.Created,
    };
  }
}
