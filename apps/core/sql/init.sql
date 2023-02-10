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

DROP TABLE IF EXISTS file_objects;
CREATE TABLE file_objects(
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  metadata TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))

);

CREATE INDEX IF NOT EXISTS file_objects_name ON file_objects(name);
CREATE INDEX IF NOT EXISTS file_objects_content_type ON file_objects(content_type);

DROP TABLE IF EXISTS api_keys;
CREATE TABLE api_keys (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  permissions TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS api_keys_name ON api_keys(name);
CREATE INDEX IF NOT EXISTS api_keys_key ON api_keys(key);