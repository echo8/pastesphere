import SqliteDb from "better-sqlite3";
import {
  Kysely,
  Migrator,
  SqliteDialect,
  Migration,
  MigrationProvider,
  Generated,
} from "kysely";
import { SnippetType } from "./types";

// Types

export type DatabaseSchema = {
  snippet: Snippet;
  auth_session: AuthSession;
  auth_state: AuthState;
};

export type Snippet = {
  id: Generated<number>;
  authorDid: string;
  rkey: string;
  title: string;
  description: string;
  type: SnippetType;
  body: string;
  createdAt: string;
};

export type AuthSession = {
  key: string;
  session: AuthSessionJson;
};

export type AuthState = {
  key: string;
  state: AuthStateJson;
};

type AuthStateJson = string;

type AuthSessionJson = string;

// Migrations

const migrations: Record<string, Migration> = {};

const migrationProvider: MigrationProvider = {
  async getMigrations() {
    return migrations;
  },
};

migrations["001"] = {
  async up(db: Kysely<unknown>) {
    await db.schema
      .createTable("snippet")
      .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
      .addColumn("authorDid", "varchar", (col) => col.notNull())
      .addColumn("rkey", "varchar", (col) => col.notNull())
      .addColumn("title", "varchar", (col) => col.notNull())
      .addColumn("description", "varchar", (col) => col.notNull())
      .addColumn("type", "varchar", (col) => col.notNull())
      .addColumn("body", "varchar", (col) => col.notNull())
      .addColumn("createdAt", "varchar", (col) => col.notNull())
      .addUniqueConstraint("did_rkey_unique", ["authorDid", "rkey"])
      .execute();
    await db.schema
      .createTable("auth_session")
      .addColumn("key", "varchar", (col) => col.primaryKey())
      .addColumn("session", "varchar", (col) => col.notNull())
      .execute();
    await db.schema
      .createTable("auth_state")
      .addColumn("key", "varchar", (col) => col.primaryKey())
      .addColumn("state", "varchar", (col) => col.notNull())
      .execute();
  },
  async down(db: Kysely<unknown>) {
    await db.schema.dropTable("auth_state").execute();
    await db.schema.dropTable("auth_session").execute();
    await db.schema.dropTable("snippet").execute();
  },
};

// APIs

export const createDb = (location: string): Database => {
  return new Kysely<DatabaseSchema>({
    dialect: new SqliteDialect({
      database: new SqliteDb(location),
    }),
  });
};

export const migrateToLatest = async (db: Database) => {
  const migrator = new Migrator({ db, provider: migrationProvider });
  const { error } = await migrator.migrateToLatest();
  if (error) throw error;
};

export type Database = Kysely<DatabaseSchema>;
