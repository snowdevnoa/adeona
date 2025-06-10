import { Client } from "pg";
import "dotenv/config"; // Ensure dotenv is loaded for process.env

const client = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  database: process.env.POSTGRES_DB,
});

async function connectToPostgres() {
  try {
    await client.connect();
    console.log("Connected to Postgres!");
  } catch (err) {
    console.error("Failed to connect to Postgres:", err);
    process.exit(1);
  }
}

// Connect immediately when the module loads
// Since Docker Compose ensures the DB is ready, this should succeed on first try.
connectToPostgres();

export default async function getMessage() {
  const result = await client.query("SELECT * FROM test_table;");
  return result.rows[0].message;
}
