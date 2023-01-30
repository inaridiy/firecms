import {
  CompiledQuery,
  QueryResult,
  Dialect,
  Driver,
  DatabaseIntrospector,
  DatabaseConnection,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
  QueryCompiler,
  Kysely,
} from "kysely";

export interface D1DialectConfig {
  database: D1Database;
}

export class D1Dialect implements Dialect {
  constructor(private config: D1DialectConfig) {}

  createAdapter() {
    return new SqliteAdapter();
  }

  createDriver(): Driver {
    return new D1Driver(this.config);
  }

  createQueryCompiler(): QueryCompiler {
    return new SqliteQueryCompiler();
  }

  createIntrospector(db: Kysely<any>): DatabaseIntrospector {
    return new SqliteIntrospector(db);
  }
}

class D1Driver implements Driver {
  constructor(private config: D1DialectConfig) {}

  async init(): Promise<void> {}

  async acquireConnection(): Promise<DatabaseConnection> {
    return new D1Connection(this.config);
  }
}

class D1Connection implements DatabaseConnection {
  constructor(private config: D1DialectConfig) {}

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult> {
    const results = await this.config.database
      .prepare(compiledQuery.sql)
      .bind(...compiledQuery.parameters)
      .all();
    if (results.error) {
      throw new Error(results.error);
    }

    return {
      rows: (results.results as O[]) || [],
    };
  }
}
