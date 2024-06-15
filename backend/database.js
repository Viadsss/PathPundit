import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getUser(username) {
  const [rows] = await pool.query(
    `
    SELECT * FROM user
    WHERE BINARY username = ?
  `,
    [username]
  );

  return rows[0];
}

export async function getUserData(username) {
  const [rows] = await pool.query(
    `
    SELECT data FROM user
    WHERE username = ?
    `,
    [username]
  );

  return rows[0];
}

export async function createUser(username, name, password) {
  await pool.query(
    `
    INSERT INTO user (username, name, password)
    VALUES (?, ?, ?)
  `,
    [username, name, password]
  );
}

export async function updateRouteData(username, data) {
  await pool.query(
    `
  UPDATE user
  SET data = ?
  WHERE username = ?
  `,
    [JSON.stringify(data), username]
  );
}
