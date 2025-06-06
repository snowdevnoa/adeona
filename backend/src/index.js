const express = require("express");
const app = express();
const port = 3000;

app.get("/api", (req, res) => {
	res.send("Hello World! No");
});

app.listen(port, () => {
	console.log(`Example app lsistening on port ${port}`);
});
