DROP TABLE IF EXISTS user_credentials;
CREATE TABLE user_credentials (
  id PRIMARY KEY,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

DROP TABLE IF EXISTS user_profile;
CREATE TABLE user_profile (
  user_id PRIMARY KEY REFERENCES user_credentials(id),
  name TEXT unique NOT NULL,
  email TEXT unique NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);
