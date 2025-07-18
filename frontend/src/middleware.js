import { NextResponse } from "next/server";

export function middleware(request) {
	if (request.cookies.has("user_access_token")) {
		console.log("User is already logged in");
		return NextResponse.redirect(new URL("/", request.url));
	} else {
		return NextResponse.next();
	}
}

export const config = {
	matcher: ["/login", "/register", "/saved-flights"],
};
