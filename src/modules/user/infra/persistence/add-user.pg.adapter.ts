import { eq, or } from "drizzle-orm/expressions";
import { PgDb } from "../../../../shared-infra/database/pg/db.ts";
import { users as userSchema } from "../../../../shared-infra/database/pg/schema.ts";
import { User } from "../../domain/models/user.models.ts";
import {
  AddUserResult,
  IAddUserRepository,
  UniqueConstraintError,
} from "../../domain/repositories/add-user.repository.ts";

export class AddUserPostgresAdapter implements IAddUserRepository {
  constructor(private readonly db: PgDb) {}

  async add(data: User): Promise<AddUserResult> {
    const userAlreadyExists = await this.db
      .select()
      .from(userSchema)
      .where(
        or(
          eq(userSchema.email, data.email),
          eq(userSchema.username, data.username),
        ),
      );
    if (userAlreadyExists.length > 0) {
      return {
        error: new UniqueConstraintError("User already exists"),
      };
    }
    await this.db.insert(userSchema).values({
      uuid: data.id,
      username: data.username,
      email: data.email,
    });

    return {
      error: undefined,
    };
  }
}
