import express from "express";
import { getMessage } from "../controllers/message-controller.js";

const router = express.Router();

router.get("/", getMessage);

export default router;