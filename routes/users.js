const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");

const router = express.Router();

//Create
router.post(
    "/signup",
    [
        check("first_name").isAlpha().isLength({ min: 2 }),
        check("last_name").isAlpha().isLength({ min: 2 }),
        check("email").normalizeEmail().isEmail(),
        check("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 chars long"),
    ],
    usersController.signUp
);
router.post(
    "/signin",
    [check("email").not().isEmpty(), check("password").not().isEmpty()],
    usersController.signIn
);

//Read
router.get("/:uid", usersController.getUserByID);

//Update
// router.patch(
//     "/:uid",
//     [
//         check("estimated_cycle_length").isNumeric(),
//         check("estimated_period_length").isNumeric(),
//     ],
//     usersController.updateUser
// );

//This route needs to change to update cycle details as you have to change everything at the same time.
// Add a update details (name and last name only) patch route
// Add a change email patch route (requires password confirmation)
// Add a forgot password patch route

//Delete
router.delete("/:uid", usersController.destroyUser);

module.exports = router;
