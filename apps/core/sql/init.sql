DROP TABLE IF EXISTS user_credentials;
CREATE TABLE user_credentials (
  id PRIMARY KEY,
  password_hash varchar(100) NOT NULL,
  password_expiration timestamp NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

DROP TABLE IF EXISTS user_profile;
CREATE TABLE user_profile (
  user_id PRIMARY KEY REFERENCES user_credential(id),
  name varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

