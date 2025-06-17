import express from 'express';
import { registerUser } from '../controllers/user-controller';


const router = express.Router()

// define the register page route
router.post('/register', registerUser) // Controller to create user in database

// define the login page route
router.get('/login', verifyUser) // Controller to verify user in database and return back jwt to client