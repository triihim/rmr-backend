const router = require("express").Router();
const { authorizeRequest } = require("../auth/auth");
const { getUserDeviceImages, getSignedUrl } = require("./image");

// Authorize all requests to image API.
router.use(authorizeRequest);

// /api/images
router.get("/", async (req, res) => {
    try {
        const imageNames = await getUserDeviceImages(req.authorizedUser.email);
        res.send(imageNames)
    } catch (error) {
        res.status(500).send();
    }
});

router.get("/:filename", async (req, res) => {
    try {
        const filename = req.params.filename.replace("-", "/");
        const signedUrl = await getSignedUrl(filename);
        res.send(signedUrl);
    } catch (error) {
        res.status(408).send();
    }
});

module.exports = router;