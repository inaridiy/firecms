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

  async beginTransaction(conn: D1Connection): Promise<void> {
    return await conn.beginTransaction();
  }

  async commitTransaction(conn: D1Connection): Promise<void> {
    return await conn.commitTransaction();
  }

  async rollbackTransaction(conn: D1Connection): Promise<void> {
    return await conn.rollbackTransaction();
  }

  async releaseConnection(_conn: D1Connection): Promise<void> {}

  async destroy(): Promise<void> {}
}

class D1Connection implements DatabaseConnection {
  constructor(private config: D1DialectConfig) {}

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
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

  async beginTransaction() {
    throw new Error("Transactions are not supported yet.");
  }

  async commitTransaction() {
    throw new Error("Transactions are not supported yet.");
  }

  async rollbackTransaction() {
    throw new Error("Transactions are not supported yet.");
  }

  async *streamQuery<O>(
    _compiledQuery: CompiledQuery,
    _chunkSize: number
  ): AsyncIterableIterator<QueryResult<O>> {
    throw new Error("Streaming are not supported yet.");
  }
}
