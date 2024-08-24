const jwt = require("jsonwebtoken");
require("dotenv").config();

async function validateAdmin(req, res, next) {
    try {
        let token = req.cookies.token;
        if (!token) return res.status(401).send("You Must Be Logged in");

        let data = await jwt.verify(token, process.env.JWT_KEY);
        req.user = data;
        next();
    } catch (err) {
        return res.status(401).send("Invalid or Expired Token");
    }
}

module.exports = validateAdmin;
