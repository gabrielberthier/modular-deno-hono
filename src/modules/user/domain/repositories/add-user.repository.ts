import { User } from "../models/user.models.ts";

export class UniqueConstraintError extends Error {}
export class InternalServerError extends Error {}

export interface AddUserResult {
  error?: UniqueConstraintError | InternalServerError;
}

export interface IAddUserRepository {
  add: (data: User) => Promise<AddUserResult>;
}
