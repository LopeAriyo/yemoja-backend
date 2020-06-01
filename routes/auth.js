const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

const HttpError = require("../models/http-error");
const User = require("../models/User");

//
router.get("/", auth, async (req, res, next) => {
    const userID = req.user.id;
    let user;
    try {
        user = await User.findById(userID, "-password");
    } catch (err) {
        const error = new HttpError("Unable to find user", 500);
        return next(error);
    }

    res.json({
        user: user.toObject({ getters: true }),
    });
});

module.exports = router;
