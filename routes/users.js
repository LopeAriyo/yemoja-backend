const express = require("express");
const usersController = require("../controllers/users-controller");

const router = express.Router();

//Create
router.post("/signup", usersController.signUp);
router.post("/signin", usersController.signIn);

//Read
router.get("/:uid", usersController.getUser);

//Update
router.patch("/:uid", usersController.updateUser);

//Delete
router.delete("/:uid", usersController.destroyUser);

module.exports = router;
