import { Client } from "pg";
import "dotenv/config"; //import environmental variables from .env file in root

const client = new Client({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	host: "adeona-db",
	port: 5432,
	database: process.env.POSTGRES_DB,
});

await client.connect();

export default async function getMessage() {
	const result = await client.query("SELECT * FROM test_table;");
	return result.rows[0].message;
}
