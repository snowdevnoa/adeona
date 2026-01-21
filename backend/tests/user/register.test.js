import { jest, test, expect, describe } from "@jest/globals";
import UserService from "../../src/services/user-service.js";
const user = new UserService();

describe("Test user registration", () => {
	//Test user registration
	// test("Should successfully create user", async () => {
	// 	const newUser = {
	// 		username: "test",
	// 		password: "test1234*",
	// 		email: "newtestemail@gmail.com",
	// 	};

	// 	const data = await user.register(newUser);

	// 	//On successful creation, return username
	// 	expect(data).toBe(newUser.username);
	// });

	//Test failed user registration - password does not meet requirement (too short, needs a symbol. . .)
	test("Should fail because of password", async () => {
		expect.assertions(1);
		const newUser = {
			username: "test3",
			password: "passwor",
			email: "test3@gmail.com",
		};
		await expect(user.register(newUser)).rejects.toThrow(Error);
	});
});
