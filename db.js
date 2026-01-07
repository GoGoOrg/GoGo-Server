const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
};

const client = new Client(dbConfig);
module.exports = client;
