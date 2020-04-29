const express = require("express");
const cyclesController = require("../controllers/cycles-controller");

const router = express.Router();

//Create
router.post("/", cyclesController.createCycle);

//Read
router.get("/user/:uid", cyclesController.getUserCycles);
router.get("/user/:uid/currentcycle", cyclesController.getUserCurrentCycle);

//Update
// router.patch("/:cid", cyclesController.updateCycle);
router.patch(
    "/user/:uid/currentcycle",
    cyclesController.updateUserCurrentCycle
);

//Delete
router.delete("/:cid", cyclesController.destroyCycle);

module.exports = router;
