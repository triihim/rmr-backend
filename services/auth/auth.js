const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../data/db-access");

function generateToken(payloadObject) {
    return new Promise((resolve, reject) => {
        const expiration = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour
        jwt.sign({ ...payloadObject, exp: expiration }, process.env.JWT_SECRET, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    })
}

function validateToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) reject();
            resolve(decoded);
        });
    });
}

async function registerUser({email, password}) {
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = { email: email, passwordHash: hash }; // TODO: user model?
        await db.insertUser(user);
        const token = await generateToken(user);
        return token;
    } catch (error) {
        throw error;
    }
}

async function loginUser({email, password}) {
    try {
        const hash = await db.getUserPasswordHash(email);
        if(await bcrypt.compare(password, hash)) {
            console.log("Login ok");
            const token = await generateToken({ email: email, passwordHash: hash }).catch(console.log); // TODO: user model?
            return token;
        } else {
            console.log("Comparison failed");
            throw error;
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function authorizeRequest(req, res, next) {
    console.log("Authorizing request...");
    const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

    if(!token) return res.status(401).json({message: "No authorization header"});

    const decodedToken = await validateToken(token);
    if(decodedToken) {
        const authorizedUser = { email: decodedToken.email };
        req.authorizedUser = authorizedUser;
        next();
    } else {
        return res.sendStatus(401);
    }
}


module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
module.exports.authorizeRequest = authorizeRequest;