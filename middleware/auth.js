const jwt = require("jsonwebtoken");
const config = require("config");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return next(new HttpError("Access Denied", 401));
        }

        jwt.verify(token, config.get("jwtSecret"), (error, decoded) => {
            if (error) {
                return res.status(401).json({ msg: "Token is not valid" });
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } catch (err) {
        const error = new HttpError("Authentication failed!", 403);
        return next(error);
    }
};
