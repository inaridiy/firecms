import { Kysely } from "kysely";
import { D1Kysely } from "../database/d1-kysely";
import { Database } from "../database/schema";
import { UserCredential } from "../models/user-credential.model";

export interface UserCredentialRepositoryInjections {
  db: D1Database;
}

export class UserCredentialRepository {
  private db: Kysely<Database>;

  constructor(inject: UserCredentialRepositoryInjections) {
    this.db = new D1Kysely(inject.db);
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
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      })
    );
  }

  async findCredentialByUserEmail(email: string) {
    const result = await this.db
      .selectFrom("user_credentials")
      .selectAll()
      .innerJoin("user_profile", "user_credentials.id", "user_profile.id")
      .where("user_profile.email", "=", email)
      .executeTakeFirst();

    return (
      result &&
      new UserCredential({
        id: result.id,
        passwordHash: result.password_hash,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      })
    );
  }

  async findCredentialByUserName(username: string) {
    const result = await this.db
      .selectFrom("user_credentials")
      .selectAll()
      .innerJoin("user_profile", "user_credentials.id", "user_profile.id")
      .where("user_profile.name", "=", username)
      .executeTakeFirst();

    return (
      result &&
      new UserCredential({
        id: result.id,
        passwordHash: result.password_hash,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      })
    );
  }
}
