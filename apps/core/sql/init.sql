DROP TABLE IF EXISTS Users;
CREATE TABLE Users (id INT, name TEXT, age INT, PRIMARY KEY (`id`));
INSERT INTO Users (id, name, age) VALUES (1, "Taro", 30),(3, "Hanako", 35),(5, "Tom", 40);