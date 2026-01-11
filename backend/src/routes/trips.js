import express from "express";
import authorizeUser from "../middleware/authorize.js";
import { saveTrip, getTrips , updateTrip} from "../controllers/trip-controller.js";

const router = express.Router();

//define the save trip route - POST
router.post("/save", authorizeUser, saveTrip);

router.get("/my-trips", authorizeUser, getTrips)

//define the update trip - PUT
router.put("/update", authorizeUser, updateTrip)

export default router;
