require("dotenv").config();
const express = require("express");
const app = express();

const authServiceRouter = require("./services/auth/router");
const imageServiceRouter = require("./services/image/router");
const deviceServiceRouter = require("./services/device/router");

app.use(express.json());

app.use((req,res,next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, HEAD");
	if(req.method === "OPTIONS") {
		return res.sendStatus(200);
	};
	next();
});

// Routes
app.use("/auth", authServiceRouter);
app.use("/api/images", imageServiceRouter);
app.use("/api/devices", deviceServiceRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port " + port));