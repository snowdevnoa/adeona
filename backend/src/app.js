import express from "express";
import cors from "cors";
import testRouter from "./routes/tests-routes.js";

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
	res.send(`Hello World!`);
});

// Enable CORS to allow cross-origin requests from the browser (e.g., frontend running on a different origin)
app.use(
	cors({
		origin: "*",
	})
);

// Import and use the test router
app.use("/tests", testRouter);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
