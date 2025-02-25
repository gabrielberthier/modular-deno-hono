import { STATUS_CODE } from "@std/http";
import {
  HttpController,
  HttpResponse,
} from "../../../protocols/presentation.protocols.ts";
import { AddUserPostgresAdapter } from "../../infra/persistence/add-user.pg.adapter.ts";
import { AddUserUseCase } from "../../domain/usecases/add-user.usecase.ts";

export default class AddUserController
  implements
    HttpController<{
      username: string;
      email: string;
    }>
{
  async handle(req: {
    username: string;
    email: string;
  }): Promise<HttpResponse<undefined>> {
    const usecase = new AddUserUseCase(new AddUserPostgresAdapter());

    const response = await usecase.execute(req);

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
