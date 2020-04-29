const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();

const DUMMY_CYCLES = [
    {
        id: 4,
        current_cycle: true,
        start_date: "03/31/2020",
        end_date: null,
        period_length: 5,
        user_id: 1,
    },
    {
        id: 3,
        current_cycle: true,
        start_date: "03/31/2020",
        end_date: "04/28/2020",
        period_length: 3,
        user_id: 2,
    },
    {
        id: 2,
        current_cycle: false,
        start_date: "02/29/2020",
        end_date: "03/30/2020",
        period_length: 4,
        user_id: 1,
    },
    {
        id: 1,
        current_cycle: false,
        start_date: "01/31/2020",
        end_date: "02/28/2020",
        period_length: 4,
        user_id: 1,
    },
];

router.get("/:cid", (req, res, next) => {
    const cycleID = parseInt(req.params.cid);
    const cycle = DUMMY_CYCLES.find(cycle => {
        return cycle.id === cycleID;
    });
    if (!cycle) {
        throw new HttpError("Could not find cycle.", 404);
    }
    res.json({ cycle });
});

router.get("/user/:uid", (req, res, next) => {
    const userID = parseInt(req.params.uid);
    const cycles = DUMMY_CYCLES.find(cycle => {
        return cycle.user_id === userID;
    });
    if (!cycles) {
        return next(
            new HttpError(
                "Could not find a cycle for the provided user id.",
                404
            )
        );
    }
    res.json({ cycles });
});

module.exports = router;
