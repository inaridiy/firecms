DROP TABLE IF EXISTS user_credential;
CREATE TABLE user_credentials (
  id PRIMARY KEY,
  password_hash varchar(100) NOT NULL,
  password_expiration timestamp NOT NULL
);

DROP TABLE IF EXISTS user_profile;
CREATE TABLE user_profile (
  user_id REFERENCES user_credential(id),
  name varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
);

