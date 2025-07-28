import express from "express";
import { searchFlight, saveFlight } from "../controllers/flight-controller.js";
import authorizeUser from "../middleware/authorize.js";
import { guestFlightSearchLimiter } from "../middleware/rate-limit.js";
import optionalAuth from "../middleware/optional-auth.js";

const router = express.Router();

// define the search route - POST
router.post("/search", optionalAuth, guestFlightSearchLimiter, searchFlight);

// define the save route - POST
router.post("/save-flight", authorizeUser, saveFlight);

export default router;
