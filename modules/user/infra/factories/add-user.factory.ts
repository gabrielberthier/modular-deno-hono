import { AddUserUseCase } from "../../domain/usecases/add-user.usecase.ts";
import { AddUserPostgresAdapter } from "../persistence/add-user.pg.adapter.ts";

export const createAddUser = () => {
    return new AddUserUseCase(new AddUserPostgresAdapter());
}