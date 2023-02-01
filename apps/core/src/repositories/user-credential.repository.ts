import { Kysely } from "kysely";
import { Database } from "../database/schema";
import { UserCredential } from "../models/user-credential.model";

export interface UserCredentialInjections {
  db: Kysely<Database>;
}

export class UserCredentialRepository {
  private db: Kysely<Database>;

  constructor(inject: UserCredentialInjections) {
    this.db = inject.db;
  }

  async create(userCredential: UserCredential) {
    await this.db
      .insertInto("user_credentials")
      .values({
        id: userCredential.props.id,
        password_hash: userCredential.props.passwordHash,
      })
      .execute();
  }

  async findCredentialByUserId(userId: string) {
    const result = await this.db
      .selectFrom("user_credentials")
      .selectAll()
      .where("id", "=", userId)
      .executeTakeFirst();

    return (
      result &&
      new UserCredential({
        id: result.id,
        passwordHash: result.password_hash,
      })
    );
  }

  async findCredentialByUserEmail(email: string) {
    const result = await this.db
      .selectFrom("user_credentials")
      .selectAll()
      .innerJoin("user_profile", "user_credentials.id", "user_profile.user_id")
      .where("user_profile.email", "=", email)
      .executeTakeFirstOrThrow();

    return (
      result &&
      new UserCredential({
        id: result.id,
        passwordHash: result.password_hash,
      })
    );
  }

  async findCredentialByUserName(username: string) {
    const result = await this.db
      .selectFrom("user_credentials")
      .selectAll()
      .innerJoin("user_profile", "user_credentials.id", "user_profile.user_id")
      .where("user_profile.name", "=", username)
      .executeTakeFirstOrThrow();

    return (
      result &&
      new UserCredential({
        id: result.id,
        passwordHash: result.password_hash,
      })
    );
  }
}
