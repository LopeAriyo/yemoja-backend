const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let DUMMY_CYCLES = [
    {
        id: 4,
        is_cycle_active: true,
        start_date: "04/29/2020",
        end_date: null,
        period_length: 5,
        user_id: 1,
    },
    {
        id: 3,
        is_cycle_active: false,
        start_date: "03/31/2020",
        end_date: "04/28/2020",
        period_length: 3,
        user_id: 1,
    },
    {
        id: 2,
        is_cycle_active: false,
        start_date: "02/29/2020",
        end_date: "03/30/2020",
        period_length: 4,
        user_id: 1,
    },
    {
        id: 1,
        is_cycle_active: false,
        start_date: "01/31/2020",
        end_date: "02/28/2020",
        period_length: 4,
        user_id: 1,
    },
];

const createCycle = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError("Invalid inputs", 422);
    }
    const { start_date, end_date, period_length, user_id } = req.body;

    const newCycle = {
        id: uuid(),
        is_cycle_active: true,
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
    const currentCycle = DUMMY_CYCLES.find(cycle => {
        return cycle.user_id === userID && cycle.is_cycle_active === true;
    });
    if (!currentCycle) {
        return next(
            new HttpError(
                "Could not find the current cycle for the provided user id.",
                404
            )
        );
    }
    res.json({ cycle: currentCycle });
};

const updateCycle = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError("Invalid inputs", 422);
    }

    const cycleID = parseInt(req.params.cid);
    const { is_cycle_active, start_date, end_date, period_length } = req.body;

    const cycleToUpdate = {
        ...DUMMY_CYCLES.find(cycle => {
            return cycle.id === cycleID;
        }),
    };

    const cycleIndex = DUMMY_CYCLES.findIndex(cycle => cycle.id === cycleID);

    //may need if statements here as not everything gets updated at the same time
    if (is_cycle_active) {
        cycleToUpdate.is_cycle_active = is_cycle_active;
    }
    if (start_date) {
        cycleToUpdate.start_date = start_date;
    }

    if (end_date) {
        cycleToUpdate.end_date = end_date;
    }

    if (period_length) {
        cycleToUpdate.period_length = period_length;
    }

    DUMMY_CYCLES[cycleIndex] = cycleToUpdate;

    if (!cycleToUpdate) {
        return next(
            new HttpError("Could not update cycle with provided id.", 404)
        );
    }

    res.status(200).json({ cycle: cycleToUpdate });
};

const updateUserCurrentCycle = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError("Invalid inputs", 422);
    }

    const userID = parseInt(req.params.uid);
    const { is_cycle_active, start_date, end_date, period_length } = req.body;

    const cycleToUpdate = {
        ...DUMMY_CYCLES.find(cycle => {
            return cycle.user_id === userID && cycle.is_cycle_active === true;
        }),
    };

    if (!cycleToUpdate) {
        return next(
            new HttpError("Could not update cycle with provided id.", 404)
        );
    }

    const cycleIndex = DUMMY_CYCLES.findIndex(
        cycle => cycle.id === cycleToUpdate.id
    );

    if (is_cycle_active) {
        cycleToUpdate.is_cycle_active = is_cycle_active;
    }
    if (start_date) {
        cycleToUpdate.start_date = start_date;
    }

    if (end_date) {
        cycleToUpdate.end_date = end_date;
    }

    if (period_length) {
        cycleToUpdate.period_length = period_length;
    }

    DUMMY_CYCLES[cycleIndex] = cycleToUpdate;

    res.status(200).json({ cycle: cycleToUpdate });
};

const destroyCycle = (req, res, next) => {
    const cycleID = parseInt(req.params.cid);

    if (DUMMY_CYCLES.find(cycle => cycle.id === cycleID)) {
        throw new HttpError("Could not find a cycle with ID", 404);
    }
    DUMMY_CYCLES = DUMMY_CYCLES.filter(cycle => cycle.id !== cycleID);
    res.status(200).json({ message: "Cycle deleted" });
};

//CRUD Exports
exports.createCycle = createCycle;
exports.getUserCycles = getUserCycles;
exports.getUserCurrentCycle = getUserCurrentCycle;
// exports.updateCycle = updateCycle;
exports.updateUserCurrentCycle = updateUserCurrentCycle;
// exports.getUserCycleByID = getUserCycleByID;
// exports.getUserPreviousCycle?
// exports.updateCurrentCyclePeriodLength = updateCurrentCyclePeriodLength;
// exports.updateCurrentCycleFromActiveToInactive = updateCycle;
// exports.updatePreviousCycleFromInactiveToActive = updateCycle; ???
exports.destroyCycle = destroyCycle;
