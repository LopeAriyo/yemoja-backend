const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const auth = require("../middleware/auth");
const usersController = require("../controllers/users-controller");

//
router.get("/", auth, usersController.getUserByToken);

//authenticate user and get token
router.post(
    "/signin",
    [check("email").not().isEmpty(), check("password").not().isEmpty()],
    usersController.signIn
);

module.exports = router;
