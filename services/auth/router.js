const router = require("express").Router();
const { validateEmail, validatePassword } = require("./validation");
const { registerUser, loginUser, validateToken } = require("./auth");

router.post("/register", async (req, res) => {
    if(validateEmail(req.body.email) && validatePassword(req.body.password)) {
        try {
            const token = await registerUser({ email: req.body.email, password: req.body.password });
            return res.status(200).json({ token: token });
        } catch (error) {
            return res.status(500).json({ message: "Registration failed"});
        }
    } else {
        return res.status(400).json({ message: "Invalid email or password" });
    }
});

router.post("/login", async (req, res) => {
    if(validateEmail(req.body.email) && validatePassword(req.body.password)) {
        try {
            const token = await loginUser({email: req.body.email, password: req.body.password });
            return res.status(200).json({ token: token });
        } catch (error) {
            return res.status(401).json({ message: "Login failed" });
        }
    } else {
        return res.status(401).json({ message: "Invalid email or password" });
    }
});

router.get("/validate", async (req, res) => {
    const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
    try {
        await validateToken(token);
        return res.status(200).send({valid: true});
    } catch(error) {
        return res.status(200).send({valid: false});
    }
})

module.exports = router;