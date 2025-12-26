import express from "express";
import authorizeUser from "../middleware/authorize.js";
import { saveTrip } from "../controllers/trip-controller.js";

const router = express.Router();

//define the save trip route - POST
router.post("/save", authorizeUser, saveTrip);

export default router;
