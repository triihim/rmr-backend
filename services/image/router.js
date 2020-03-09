const router = require("express").Router();
const { authorizeRequest } = require("../auth/auth");

// Authorize all requests to image API.
router.use(authorizeRequest);

router.get("/images", (req, res) => {

});

module.exports = router;