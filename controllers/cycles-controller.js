const uuid = require("uuid/v4");
const HttpError = require("../models/http-error");

let DUMMY_CYCLES = [
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

const createCycle = (req, res, next) => {
    const { start_date, end_date, period_length, user_id } = req.body;

    const newCycle = {
        id: uuid(),
        current_cycle: true,
        start_date,
        end_date,
        period_length,
        user_id,
    };

    DUMMY_CYCLES.push(newCycle);

    res.status(201).json({ cycle: newCycle });
};

const getUserCycles = (req, res, next) => {
    const userID = parseInt(req.params.uid);
    const cycles = DUMMY_CYCLES.filter(cycle => {
        return cycle.user_id === userID;
    });
    if (!cycles || cycles.length === 0) {
        return next(
            new HttpError(
                "Could not find any cycle for the provided user id.",
                404
            )
        );
    }
    res.json({ cycles });
};

const getUserCurrentCycle = (req, res, next) => {
    const userID = parseInt(req.params.uid);
    const current_cycle = DUMMY_CYCLES.find(cycle => {
        return cycle.user_id === userID && cycle.current_cycle === true;
    });
    if (!current_cycle) {
        return next(
            new HttpError(
                "Could not find the current cycle for the provided user id.",
                404
            )
        );
    }
    res.json({ current_cycle });
};

const destroyCycle = (req, res, next) => {
    const cycleID = parseInt(req.params.cid);
    DUMMY_CYCLES = DUMMY_CYCLES.filter(cycle => cycle.id !== cycleID);
    res.status(200).json({ message: "Cycle deleted" });
};

//CRUD Exports
exports.createCycle = createCycle;
exports.getUserCycles = getUserCycles;
exports.getUserCurrentCycle = getUserCurrentCycle;
// exports.getUserCycleByID = getUserCycleByID;
// exports.getUserPreviousCycle?
// exports.updateCurrentCyclePeriodLength = updateCurrentCyclePeriodLength;
// exports.updateCurrentCycleFromActiveToInactive = updateCycle;
// exports.updatePreviousCycleFromInactiveToActive = updateCycle; ???
exports.destroyCycle = destroyCycle;
