import pool from "../config/db.js";

export default class MessageService {
	async getMessage() {
		const result = await pool.query("SELECT * FROM test_table;");
		return result.rows[0].message;
	}
}
