const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const auth = require("../middleware/auth");
const HttpError = require("../models/http-error");
const User = require("../models/User");
const usersController = require("../controllers/users-controller");

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

//authenticate user and get token
router.post(
    "/signin",
    [check("email").not().isEmpty(), check("password").not().isEmpty()],
    usersController.signIn
);

module.exports = router;
