DROP TABLE IF EXISTS user_credentials;
CREATE TABLE user_credentials (
  id PRIMARY KEY,
  password_hash varchar(100) NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);
INSERT INTO user_credentials (id, password_hash) VALUES ("441b3fcc-6dfd-4c9d-9af5-06e4b4dca7db","37268335dd6931045bdcdf92623ff819a64244b53d0e746d438797349d4da578");

DROP TABLE IF EXISTS user_profile;
CREATE TABLE user_profile (
  user_id PRIMARY KEY REFERENCES user_credentials(id),
  name varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);
INSERT INTO user_profile (user_id, name, email) VALUES ("441b3fcc-6dfd-4c9d-9af5-06e4b4dca7db","Admin","admin@localhost");