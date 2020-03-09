const router = require("express").Router();
const { authorizeRequest } = require("../auth/auth");
const { getUserDeviceImages, getSignedUrl } = require("./image");
const { validateDeviceOwnership } = require("../device/validate-owner");

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
        const deviceId = filename.split("/")[0];
        
        if (await validateDeviceOwnership(deviceId, req.authorizedUser.email) === false) {
            return res.sendStatus(403);
        }

        const signedUrl = await getSignedUrl(filename);
        res.send(signedUrl);
    } catch (error) {
        res.status(404).send();
    }
});

module.exports = router;