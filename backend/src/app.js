import express from "express";
import cors from "cors";
import testRouter from "./routes/tests-routes.js";

const app = express();
const port = 3000;


// Enable CORS to allow cross-origin requests from the browser (e.g., frontend running on a different origin)
app.use(
	cors({
		origin: "*",
	})
);

// Parse any incoming JSON data
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 


app.get("/", async (req, res) => {
	res.send(`Hello World!`);
});

// Import and use the test router
app.use("/tests", testRouter);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
