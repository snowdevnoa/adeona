import pool from "../config/db.js";

export default class UserModel{

    static async create(user){
        // Object destructuring
        const {username, email, password} = user
        const newUser = await pool.query(
            `INSERT INTO users (username, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING *
            `, [username, email, password]) // paramtized sql to avoid SQL injection
        return newUser;
    }

    static async check(user){
        const {username, email} = user
        const existingUsers = await pool.query(
            `SELECT * FROM users
             WHERE users.username = $1 OR users.email = $2`
            , [username, email])
        if(existingUsers.rowCount > 0) return existingUsers;
        return false
    }
}