const router = require("express").Router();
const { authorizeRequest } = require("../auth/auth");
const { getUserDeviceImages, getSignedUrl } = require("./image");
const { validateDeviceOwnership } = require("../device/validate-owner");
const { Storage } = require("@google-cloud/storage");
const { authorizeDevice } = require("../auth/auth");

// /api/images
router.get("/", authorizeRequest, async (req, res) => {
    try {
        const imageNames = await getUserDeviceImages(req.authorizedUser.email);
        res.status(200).send(imageNames)
    } catch (error) {
        res.status(500).send();
    }
});

router.get("/:filename", authorizeRequest, async (req, res) => {
    try {
        const filename = req.params.filename.replace("-", "/");
        const deviceId = filename.split("/")[0];
        
        if (await validateDeviceOwnership(deviceId, req.authorizedUser.email) === false) {
            return res.sendStatus(403);
        }

        const signedUrl = await getSignedUrl(filename);
        res.status(200).send(signedUrl);
    } catch (error) {
        res.status(404).send();
    }
});

router.post("/", async(req, res) => {

    // TODO: Move logic into a function under image.js

    const getFilepath = (tag) => tag + "/" + Date.now() + ".jpg";

    const device = req.headers["rmr_tag"];
    if(await authorizeDevice(device)) {
        const bucketName = process.env.BUCKET_NAME;
        const storage = new Storage({projectId: process.env.GCP_PROJECT_ID, keyFilename: process.env.GCP_CREDENTIALS_FILENAME});
        const file = storage.bucket(bucketName).file(getFilepath(device));

        const storageStream = file.createWriteStream({metadata: {contentType: "image/jpeg"}});

        storageStream.on("finish", () => {
            console.log("Finished");
            res.status(200).send("Finished");
        });

        storageStream.on("error", (error) => {
            console.log(error);
            res.status(500).send("Storage error");
        });

        req.pipe(storageStream)
        .on("end", () => {
            console.log("Image stored");
            res.status(200).send("Req ended");
        })
        .on("error", (error) => {
            console.log(error);
            res.status(500).send("Error");
        })
        
    } else {
        console.log("Unauthorized device");
        res.status(401).send();
    }
})

module.exports = router;