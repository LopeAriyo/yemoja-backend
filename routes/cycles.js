const express = require("express");
const { check } = require("express-validator");

const cyclesController = require("../controllers/cycles-controller");

const router = express.Router();

//Create
router.post(
    "/",
    [
        check("is_cycle_active").isBoolean(),
        check("start_date").not().isEmpty(),
        // check("cycle_length").isNumeric(),
        // check("period_length").isNumeric(),
    ],
    cyclesController.createCycle
);

//Read
router.get("/:cid", cyclesController.getCycleByID);
router.get("/user/:uid", cyclesController.getUserCycles);
router.get("/user/:uid/currentcycle", cyclesController.getUserCurrentCycle);

//Update
// router.patch("/:cid", cyclesController.updateCycle);
// router.patch(
//     "/user/:uid/currentcycle",
//     [
//         check("is_cycle_active").isBoolean(),
//         check("start_date").not().isEmpty(),
//         check("cycle_length").isNumeric(), //if cycle hasn't ended then the cycle length is the same as the current day minus start date
//         check("period_length").isNumeric(),
//     ],
//     cyclesController.updateUserCurrentCycle
// );

//Delete
router.delete("/:cid", cyclesController.destroyCycle);

module.exports = router;
