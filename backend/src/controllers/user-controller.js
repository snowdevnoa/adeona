import UserService from "../services/user-service.js";

const user = new UserService();

// Create and define controllers from the users route
export const registerUser = async (req, res) => {
	try {
		const newUser = req.body;

		// Validate new user info and add to database service
		const registeredUser = await user.register(newUser); // wait for registration
		// Respond back to client with success
		res.status(200).send(`Welcome to Adeona ${registeredUser}!`);
	} catch (err) {
		// Respond back to client with error
		console.error(err);
		res.status(400).json({ error: err + ", registration failed" });
	}
};

export const loginUser = async (req, res) => {
	try {
		const existingUser = req.body;

		// Validate existing user and return jwt token
		const loginUser = await user.login(existingUser);

		// Respond back to client with success
		res.status(200).send(loginUser);
	} catch (err) {
		// Respond back to client with error
		console.log(err);
		res.status(400).json({ error: err + ", login failed" });
	}
};

export const getUserProfile = async (req, res) => {
	try {
		const activeUser = req.user;
		// Grab user profile data
		const profileData = await user.getProfile(activeUser);
		res.status(200).send(profileData);
	} catch (err) {
		// Could not get user profile
		console.log(err);
		res.status(400).json({ error: err });
	}
};
