import { Kysely } from "kysely";
import { Database } from "../database/schema";
import { UserProfile } from "../models/user-profile.model";

export interface UserProfileRepositoryInjections {
  db: Kysely<Database>;
}

export class UserProfileRepository {
  private db: Kysely<Database>;

  constructor(inject: UserProfileRepositoryInjections) {
    this.db = inject.db;
  }

  async create(userProfile: UserProfile) {
    await this.db
      .insertInto("user_profile")
      .values({
        user_id: userProfile.props.id,
        name: userProfile.props.name,
        email: userProfile.props.email,
      })
      .execute();
  }

  async findProfileByUserId(userId: string) {
    const result = await this.db
      .selectFrom("user_profile")
      .selectAll()
      .where("user_id", "=", userId)
      .executeTakeFirst();

    return (
      result &&
      new UserProfile({
        id: result.user_id,
        name: result.name,
        email: result.email,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      })
    );
  }
}
