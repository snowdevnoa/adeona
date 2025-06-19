import express from "express";
import { loginUser, registerUser } from "../controllers/user-controller.js";

const router = express.Router();

// define the register page route
router.post("/register", registerUser); // Controller to create user in database

// define the login page route
router.post("/login", loginUser); // Controller to verify user in database and return back jwt to client

export default router;
