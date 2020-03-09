require("dotenv").config();
const express = require("express");
const app = express();

const authServiceRouter = require("./services/auth/router");
const imageServiceRouter = require("./services/image/router");
const deviceServiceRouter = require("./services/device/router");

app.use(express.json());

// Routes
app.use("/auth", authServiceRouter);
app.use("/api/images", imageServiceRouter);
app.use("/api/devices", deviceServiceRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port " + port));