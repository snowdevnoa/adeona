import express from "express";
import { loginUser, registerUser, getUserProfile, logoutUser } from "../controllers/user-controller.js";
import authorizeUser from "../middleware/authorize-middleware.js"


const router = express.Router();

// define the register route
router.post("/register", registerUser); // Controller to create user in database

// define the login route
router.post("/login", loginUser); // Controller to verify user in database and return back jwt to client

// define the logout route
router.post("/logout", logoutUser);

// define the profile route
router.get("/profile", authorizeUser, getUserProfile)


export default router;
