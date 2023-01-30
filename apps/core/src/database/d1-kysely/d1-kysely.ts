import { Kysely } from "kysely";
import { D1Dialect } from "./D1Dialect";

export class D1Kysely<T> extends Kysely<T> {
  constructor(db: D1Database) {
    super({
      dialect: new D1Dialect({
        database: db,
      }),
    });
  }
}
