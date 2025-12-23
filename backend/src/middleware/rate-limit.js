import { rateLimit } from "express-rate-limit";

// 3 requests per hour per IP for guests
export const guestFlightSearchLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 mins
	max: 3, // Limit each IP to 3 requests per `windowMs`
	message: {
		status: 429,
		error: "Oops! You’ve hit the guest search limit (3 per hour). Create an account or sign in for unlimited access.",
	},
	skip: (req, res) => !!req.user, // skip if user is authenticated
	standardHeaders: true,
	legacyHeaders: false,
	ipv6Subnet: 56,
});
