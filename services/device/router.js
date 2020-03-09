const router = require("express").Router();
const { authorizeRequest } = require("../auth/auth");
const { registerDevice } = require("./register");

// Authorize all requests to image API.
router.use(authorizeRequest);

// /api/devices
router.get("/", (req, res) => {
    res.send("Devices");
});

router.post("/register", async (req, res) => {
    const device = { deviceId: req.body.deviceId, ownerEmail: req.authorizedUser.email };
    try {
        await registerDevice(device);
        res.status(201).json({ message: "Device registered" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Device registration failed" });
    }
});

module.exports = router;