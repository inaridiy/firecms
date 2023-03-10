import { Kysely } from "kysely";
import { D1Kysely } from "../database/d1-kysely";
import { Database } from "../database/schema";
import { UserProfile } from "../models/user-profile.model";

export interface UserProfileRepositoryInjections {
  db: D1Database;
}

export class UserProfileRepository {
  private db: Kysely<Database>;

  constructor(inject: UserProfileRepositoryInjections) {
    this.db = new D1Kysely(inject.db);
  }

  async create(userProfile: UserProfile) {
    await this.db
      .insertInto("user_profile")
      .values({
        id: userProfile.props.id,
        name: userProfile.props.name,
        email: userProfile.props.email,
      })
      .execute();
  }

  async findProfileByUserId(userId: string) {
    const result = await this.db
      .selectFrom("user_profile")
      .selectAll()
      .where("id", "=", userId)
      .executeTakeFirst();

    return (
      result &&
      new UserProfile({
        id: result.id,
        name: result.name,
        email: result.email,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      })
    );
  }
}
