import { Pool } from "pg";

//Define configuration for pool
const poolConfig = process.env.DATABASE_URL
	? {
			connectionString: process.env.DATABASE_URL,
			// SSL is required for Railway's internal/external connections
			ssl: { rejectUnauthorized: false },
		}
	: {
			host: process.env.POSTGRES_HOST,
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			port: 5432,
			database: process.env.POSTGRES_DB,
			ssl: false, // No SSL for local Docker dev
		};

//Create pool
const pool = new Pool(poolConfig);

export const connectDB = async () => {
	// Check connection once, but don't hold it open
	pool
		.query("SELECT 1")
		.then(() => console.log("✅ Connected to Postgres!"))
		.catch((err) => {
			console.error("❌ Failed to connect to Postgres:", err);
			process.exit(1);
		});

	// Clean up pool on app shutdown (for dev)
	process.on("SIGINT", async () => {
		await pool.end(); // closes all idle clients
		console.log("🛑 Postgres pool has ended");
		process.exit(0);
	});
};

export default pool;
