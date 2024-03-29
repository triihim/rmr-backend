const router = require("express").Router();
const { authorizeRequest } = require("../auth/auth");
const { registerDevice } = require("./register");

// Authorize all requests to the API.
router.use(authorizeRequest);

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