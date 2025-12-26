import express from "express";
import cors from "cors";
import userRouter from "./routes/users.js";
import flightRouter from "./routes/flights.js";
import tripRouter from "./routes/trips.js";
import "dotenv/config";

const app = express();
const port = 3000;

// Enable CORS to allow cross-origin requests from the browser (e.g., frontend running on a different origin)
app.use(
	cors({
		origin: process.env.DEV_CORS_ORIGIN,
		credentials: true,
	})
);

// Parse any incoming JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
	res.send(`Hello World!`);
});

app.use("/users", userRouter);

app.use("/flights", flightRouter);

app.use("/trips", tripRouter);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
