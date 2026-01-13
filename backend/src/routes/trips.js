import express from "express";
import authorizeUser from "../middleware/authorize.js";
import { saveTrip, getTrips , updateTrip, deleteTrip} from "../controllers/trip-controller.js";

const router = express.Router();

//define the save trip route - POST
router.post("/save", authorizeUser, saveTrip);

router.get("/my-trips", authorizeUser, getTrips)

//define the update trip - PUT
router.put("/update", authorizeUser, updateTrip)

//define the delete trip route - DELETE
router.delete("/delete-trip", authorizeUser, deleteTrip)

export default router;
