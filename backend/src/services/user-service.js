export default class UserService {
	/*
    Expected mockup data from client form -
    {
        username:
        email:
        password:
    }
    */

	async register(user) {
		// Check if user already exists in database - email OR username
		// if user does exist, return error that one of those entity exist
		// if user does not exist, add user to database
            // 1. hash the user password using argon2 (salt and parameters)

            // 2. store user info into sql
            // .toLowercase() on emails

            // 3. return success
	}

    async login(){
        
    }
}
