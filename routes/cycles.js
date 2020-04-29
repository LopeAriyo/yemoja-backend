const express = require("express");
const cyclesController = require("../controllers/cycles-controller");

const router = express.Router();

//Create
router.post("/", cyclesController.createCycle);

//Read
router.get("/user/:uid", cyclesController.getUserCycles);
router.get("/user/:uid", cyclesController.getUserCurrentCycle);
//TODOs
// + Previous Cycle(s)??

//Update
//TODOs
//+ Update to inactive cycle
//+

//Delete
router.delete("/:cid", cyclesController.destroyCycle);

module.exports = router;
