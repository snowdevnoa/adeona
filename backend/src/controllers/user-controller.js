import UserService from "../services/user-service";

const user = new UserService();

// Create and define controllers from the users route
export const registerUser = async (req, res) => {
	try {
		// Parse json data into object from client using built in express middleware
		const newUser = req.body;

		// Validate new user info and add to database service
		await user.register(newUser); // wait for registration

		// Respond back to client with success
		res.status(200).send(`Welcome to Adeona ${newUser.username}!`);
	} catch (err) {
		// Respond back to client with error
		console.error(err);
		res.status(500).json({ error: "Registration failed" });
	}
};


export const loginUser = async(req,res)=>{
    
}