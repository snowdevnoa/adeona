import { Client } from "pg";
import "dotenv/config";

const client = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  database: process.env.POSTGRES_DB,
});

async function connectWithRetry(retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await client.connect();
      console.log("Connected to Postgres!");
      return;
    } catch (err) {
      console.log(`Postgres connection failed. Retry ${i + 1}/${retries} in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2; // Exponential backoff
    }
  }
  throw new Error("Could not connect to Postgres after several retries.");
}

// Connect before exporting your function
await connectWithRetry();

export default async function getMessage() {
  const result = await client.query("SELECT * FROM test_table;");
  return result.rows[0].message;
}
