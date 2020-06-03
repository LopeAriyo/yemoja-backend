const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const auth = require("../middleware/auth");
const HttpError = require("../models/http-error");
const usersController = require("../controllers/users-controller");

//
router.get("/", auth, usersController.getUserByID);

//authenticate user and get token
router.post(
    "/signin",
    [check("email").not().isEmpty(), check("password").not().isEmpty()],
    usersController.signIn
);

module.exports = router;
