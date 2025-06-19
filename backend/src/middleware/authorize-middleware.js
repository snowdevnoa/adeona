import jwt from "jsonwebtoken";

// Self note: look into refresh tokens to use with access tokens
export default function authorizeUser(req, res, next) {
	// Get token from client http cookie
	const clientToken = req.headers.authorization;
	// console.log(clientToken) this returns a string: Bearer {token}
	if (!clientToken || !clientToken.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ error: "Authorization token missing or malformed" });
	}
	const token = clientToken.split(" ", 2)[1];
	// Verify token
	// jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
	// 	if (err) {
	// 		res
	// 			.status(401)
	// 			.json({ err: "Your session has expired, please login again." });
	// 	} else {
	// 		console.log("You are authorized to continue, decoded token: " + decoded);
	// 		// Pass user data to next middleware or controller
	// 		req.user = decoded;
	// 		next();
	// 	}
	// });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
        // console.log("You are authorized to continue, decoded token: " + decoded)
		next();
	} catch (err) {
		res
			.status(401)
			.json({ err: "Your session has expired, please login again." });
	}
}
