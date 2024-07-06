CREATE DATABASE DesalgoProject;
USE DesalgoProject;

CREATE TABLE IF NOT EXISTS user (
  username VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  password CHAR(60) NOT NULL,
  data TEXT
);

