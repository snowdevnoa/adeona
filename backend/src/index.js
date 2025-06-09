import express from "express";
import getMessage from "./config/db.js";

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
	try {
		const message = await getMessage();
		res.send(`Hello World! ${message}`);
	} catch (err) {
		res.status(500).send("Failed to fetch message from DB.");
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
