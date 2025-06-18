import argon2 from "argon2";
import z from "zod/v4";
import UserModel from "../models/user-model.js";

export default class UserService {
	/*
    Expected mockup data from client form -
    {
        username:
        email:
        password:
    }
    */

	async register(user) {
		// Validate user input using zod library
		const User = z.object({
			username: z.string().regex(/^[a-zA-Z0-9_]+$/),
			email: z.email("The email is not valid"),
			password: z
				.string()
				.min(8, "Password must be at least 8 characters long")
				.regex(
					/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
					"Password must contain at least one number and one special character"
				),
		});

		try {
			User.parse(user);
		} catch (err) {
			if (err instanceof z.ZodError) throw new Error(err.issues[0].message);
		}

		// Object destructering
		const { username, email, password } = user;

		// normalize the email
		const normalizedEmail = email.toLowerCase();

		// Check if user already exists in database - email OR username
		const existingUser = await UserModel.check({
			username,
			email: normalizedEmail,
		});

		// if user does not exist add user to database or else return error
		if (!existingUser) {
			// 1. hash the user password using argon2 (salt and parameters), .toLowercase() on emails
			const hashedPassword = await argon2.hash(password);
			// 2. store user info into sql by calling the user model
			const newUser = await UserModel.create({
				username,
				email: normalizedEmail,
				password: hashedPassword,
			});
			// 3. return success
			return newUser.rows[0].username;
		} else {
			if (existingUser.rows[0].username === username)
				throw new Error(`Username already exists`);
			if (existingUser.rows[0].email === email.toLowerCase())
				throw new Error(`Email already exists`);
		}
	}

	async login() {}
}
