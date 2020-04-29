const express = require("express");
const usersController = require("../controllers/users-controller");

const router = express.Router();

router.post("/signup", usersController.signUp);

router.post("/signin", usersController.signIn);

router.get("/:uid", usersController.getUser);

router.delete("/:uid", usersController.destroyUser);

module.exports = router;
