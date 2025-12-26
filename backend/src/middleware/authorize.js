import jwt from "jsonwebtoken";
import { parse } from "cookie";

// Self note: look into refresh tokens to use with access tokens
// Strict auth for protected routes
export default function authorizeUser(req, res, next) {
	// Get token from client http cookie
	const cookies = parse(req.headers.cookie);
	const clientToken = cookies.user_access_token;
	// console.log(cookies.user_access_token);
	// console.log(clientToken);

	if (!clientToken || !clientToken.startsWith("Bearer ")) {
		return res.status(401).json({ error: "User is not logged in" });
	}
	const token = clientToken.split(" ", 2)[1];
	// Verify token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		//Expose only safe authorize user info like id and role
		req.user = { id: decoded.id, role: decoded.role };
		// console.log("You are authorized to continue, decoded token: " + decoded)
		next();
	} catch (err) {
		res
			.status(401)
			.json({ err: "Your session has expired, please login again." });
	}
}
