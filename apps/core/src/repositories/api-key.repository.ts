import { Kysely } from "kysely";
import { D1Kysely, Database } from "../database";
import { APIKey } from "../models/api-key.model";

export interface APIKeyRepositoryInjections {
  db: D1Database;
}

export class APIKeyRepository {
  private db: Kysely<Database>;

  constructor(inject: APIKeyRepositoryInjections) {
    this.db = new D1Kysely(inject.db);
  }

  async create(apiKey: APIKey) {
    await this.db
      .insertInto("api_keys")
      .values({
        id: apiKey.props.id,
        name: apiKey.props.name,
        key: apiKey.props.key,
        permissions: JSON.stringify(apiKey.props.permissions),
      })
      .execute();
  }
}
