DROP TABLE IF EXISTS user_credentials;
CREATE TABLE user_credentials (
  id TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);


DROP TABLE IF EXISTS user_profile;
CREATE TABLE user_profile (
  id TEXT PRIMARY KEY REFERENCES user_credentials(id),
  name TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS user_profile_name ON user_profile(name);
CREATE INDEX IF NOT EXISTS user_profile_email ON user_profile(email);


DROP TABLE IF EXISTS content_types;
CREATE TABLE content_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  table_name TEXT UNIQUE NOT NULL,
  schema TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS content_types_name ON content_types(name);
CREATE INDEX IF NOT EXISTS content_types_table_name ON content_types(table_name);