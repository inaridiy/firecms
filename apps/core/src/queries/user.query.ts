import { Kysely } from "kysely";
import { D1Kysely } from "../database/d1-kysely";
import { Database } from "../database/schema";

export interface UserQueryInjections {
  db: D1Database;
}

interface QueryUsersData {
  email?: string;
  name?: string;
  q?: string;
  id?: string;
  ids?: string;
  limit?: number;
  offset?: number;
}

const DEFAULT_USERS_LIMIT = 10;

export class UserQueryService {
  private db: Kysely<Database>;

  constructor(inject: UserQueryInjections) {
    this.db = new D1Kysely(inject.db);
  }

  queryUsers(data: QueryUsersData) {
    let query = this.db.selectFrom("user_profile").selectAll();

    if (data.email) query = query.where("email", "=", data.email);
    if (data.name) query = query.where("name", "=", data.name);
    if (data.id) query = query.where("id", "=", data.id);
    if (data.ids) query = query.where("id", "in", data.ids.split(","));
    if (data.q) {
      for (const column of ["email", "name"] as const)
        query = query.orWhere(column, "like", `%${data.q}%`);
    }

    query = query
      .offset(data.offset ?? 0)
      .limit(data.limit ?? DEFAULT_USERS_LIMIT);

    return query.execute();
  }
}
