const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const Cycle = require("../models/cycle");

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

const createCycle = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs", 422));
    }
    const { is_cycle_active, start_date, user_id } = req.body;

    const newCycle = new Cycle({
        is_cycle_active,
        start_date,
        cycle_length: 1,
        period_length: 1,
        user_id,
    });

    try {
        await newCycle.save();
    } catch (err) {
        const error = new HttpError(
            "Creating cycle failed, please try again.",
            500
        );
        return next(error);
    }

    res.status(201).json({ cycle: newCycle });
};

const getCycleByID = async (req, res, next) => {
    const cycleID = req.params.cid;

    let cycle;

    try {
        cycle = await Cycle.findById(cycleID);
    } catch (err) {
        const error = new HttpError("Unable to find cycle", 500);
        return next(error);
    }

    if (!cycle) {
        const error = new HttpError(
            "Could not find any cycle for the provided id.",
            404
        );
        return next(error);
    }

    res.json({
        cycle: cycle.toObject({ getters: true }),
    });
};

const getUserCycles = async (req, res, next) => {
    const userID = req.params.uid;

    let cycles;

    try {
        cycles = await Cycle.find({ user_id: userID });
    } catch (err) {
        const error = new HttpError(
            "Fetching cycles failed, please try again later",
            500
        );
        return next(error);
    }

    if (!cycles || cycles.length === 0) {
        return next(
            new HttpError(
                "Could not find any cycle for the provided user id.",
                404
            )
        );
    }
    res.json({
        cycles: cycles.map(cycle => cycle.toObject({ getters: true })),
    });
};

const getUserCurrentCycle = async (req, res, next) => {
    const userID = req.params.uid;

    let currentCycle;

    try {
        currentCycle = await Cycle.find({
            user_id: userID,
            is_cycle_active: true,
        });
    } catch (err) {
        const error = new HttpError(
            "Fetching cycles failed, please try again later",
            500
        );
        return next(error);
    }

    if (!currentCycle) {
        return next(
            new HttpError(
                "Could not find the current cycle for the provided user id.",
                404
            )
        );
    }

    res.json({
        cycle: currentCycle.map(cycle => cycle.toObject({ getters: true })),
    });
};

const updateCycle = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError("Invalid inputs", 422);
    }

    const cycleID = req.params.cid;
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

    const userID = req.params.uid;
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

const destroyCycle = async (req, res, next) => {
    const cycleID = req.params.cid;

    let cycle;

    try {
        cycle = await Cycle.findById(cycleID);
    } catch (err) {
        const error = new HttpError("Unable to find cycle to delete", 500);
        return next(error);
    }

    try {
        await cycle.remove();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, unable to delete",
            500
        );
        return next(error);
    }

    res.status(200).json({ message: "Cycle deleted" });
};

//CRUD Exports
exports.createCycle = createCycle;
exports.getCycleByID = getCycleByID;
exports.getUserCycles = getUserCycles;
exports.getUserCurrentCycle = getUserCurrentCycle;
// exports.getUserPreviousCycle?
// exports.updateCycle = updateCycle;
// exports.updateUserCurrentCycle = updateUserCurrentCycle;
// exports.updateCurrentCyclePeriodLength = updateCurrentCyclePeriodLength;
// exports.updateCurrentCycleFromActiveToInactive = updateCycle;
// exports.updatePreviousCycleFromInactiveToActive = updateCycle; ???
exports.destroyCycle = destroyCycle;
