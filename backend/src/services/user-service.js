import argon2 from "argon2";
import z from "zod/v4";
import UserModel from "../models/user-model.js";
import jwt from "jsonwebtoken";

export default class UserService {
	/*
    Expected mockup data from client registration form -
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
					"Password must contain at least one number and one special character (!@#$%^&*-+._)"
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

	/*
    Expected mockup data from client login form -
    {
        username:
        password:
    }
    */
	async login(user) {
		// validate user input using zod library
		const User = z.object({
			username: z.string().regex(/^[a-zA-Z0-9_]+$/),
			password: z
				.string()
				.min(8, "Invalid credentials")
				.regex(
					/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
					"Invalid credentials"
				),
		});

		try {
			User.parse(user);
		} catch (err) {
			if (err instanceof z.ZodError) throw new Error(err.issues[0].message);
		}

		// Object destructuring
		const { username, password } = user;

		// Find user
		const existingUser = await UserModel.find(username);

		// If user exists verify the passwords match
		if (existingUser) {
			// Verify password input and password of user in database
			try {
				if (await argon2.verify(existingUser.password_hash, password)) {
					// Return JWT token

					// Payload, header, signature
					const secretKey = process.env.JWT_SECRET;
					console.log("User is verified");
					console.log(secretKey);
					const token = jwt.sign(
						{
							id: existingUser.user_id,
							username: existingUser.username,
							role: "user",
						},
						secretKey,
						{ expiresIn: "1hr" } // set expiration for good security practice
					);
					console.log(token);
					return { message: "Congrats you are now logged in", token };
				} else {
					throw Error;
				}
			} catch (err) {
				// Invalid password
				throw new Error("Invalid credentials");
			}
		} else {
			// Invalid user
			throw new Error("Invalid credentials");
		}
	}

	/*
		Expected mockup from authorized/logged in user:
		{
			id:
			username:
			role:

		}
	*/
	async getProfile(user) {
		try{
			const { id } = user;
			const profile = await UserModel.getById(id);
			return profile;
		}catch(err){
			throw new Error("Sorry we could not find that user")
		}
	}
}
