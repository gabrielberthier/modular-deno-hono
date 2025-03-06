import { randomUUID } from "node:crypto";
import { IAddUserRepository } from "../repositories/add-user.repository.ts";

export interface AddUserUseCaseInput {
  username: string;
  email: string;
}

export class AddUserUseCase {
  constructor(private readonly addUserRepository: IAddUserRepository) {}

  async execute(user: AddUserUseCaseInput) {
    return await this.addUserRepository.add({
      ...user,
      id: randomUUID(),
    });
  }
}
