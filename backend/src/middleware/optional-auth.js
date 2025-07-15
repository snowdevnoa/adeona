import jwt from "jsonwebtoken";
import { parse } from "cookie";

// non-blocking: attach req.user if valid token, otherwise continue
export default function optionalAuth(req, res, next) {
	const cookies = parse(req.headers.cookie || "");
	const clientToken = cookies.access_token;

	if (clientToken && clientToken.startsWith("Bearer ")) {
		const token = clientToken.split(" ")[1];

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;
		} catch (err) {
			// Invalid token → proceed as guest
		}
	}

	next();
}
