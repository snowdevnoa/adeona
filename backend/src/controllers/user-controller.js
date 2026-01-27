import UserService from "../services/user-service.js";
import cookie from "cookie";

const user = new UserService();

// Create and define controllers from the users route
export const registerUser = async (req, res) => {
	try {
		const newUser = req.body;

		// Validate new user info and add to database service
		const registeredUser = await user.register(newUser); // wait for registration
		// Respond back to client with success
		res.status(200).json({ success: `Welcome ${registeredUser} to adeona!` });
	} catch (err) {
		// Respond back to client with error
		console.error(err);
		res.status(400).json({ error: err.message });
	}
};

export const loginUser = async (req, res) => {
	try {
		const existingUser = req.body;

		// Validate existing user and return jwt token
		const loginUser = await user.login(existingUser);

		// Respond back to client with success
		res
			.status(200)
			.cookie("user_access_token", `Bearer ${loginUser.token}`, {
				maxAge: 3600 * 1000, // cookie 1hr max same as token
				secure: true,
				httpOnly: true,
				sameSite: "none",
			})
			.json({ message: loginUser.message });
	} catch (err) {
		// Respond back to client with error
		console.log(err);
		res.status(400).json({ error: err.message });
	}
};

export const logoutUser = async (req, res) => {
	try {
		const cookieOptions = {
			httpOnly: true,
			path: "/",
			// Only use secure/none in production (Railway)
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		};

		// Use express clear cookie method to work with cloud production environment
		res.clearCookie("user_access_token", cookieOptions);
		res.status(200).json({ success: "Logged out successfully" });
	} catch {
		res.status(400).json({ error: "We could not log you out." });
	}
};

export const getUserProfile = async (req, res) => {
	try {
		const activeUser = req.user;
		// Grab user profile data
		const profileData = await user.getProfile(activeUser);
		res.status(200).json(profileData);
	} catch (err) {
		// Could not get user profile
		console.log(err);
		res.status(400).json({ error: err });
	}
};
