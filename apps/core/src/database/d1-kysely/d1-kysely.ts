import { Kysely, Generated } from "kysely";
import { D1Dialect } from "./D1Dialect";
import { Database } from "../../config";

export class D1Kysely<T = Database> extends Kysely<T> {
  constructor(db: D1Database) {
    super({
      dialect: new D1Dialect({
        database: db,
      }),
    });
  }
}
