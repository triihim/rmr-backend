const router = require("express").Router();
const { authorizeRequest } = require("../auth/auth");

// Authorize all requests to image API.
router.use(authorizeRequest);

// /api/images
router.get("/", (req, res) => {
    res.send("Images")
});

module.exports = router;