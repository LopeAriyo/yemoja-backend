const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

let DUMMY_USERS = [
    {
        id: 1,
        first_name: "Lope",
        last_name: "Ariyo",
        email: "lariyo@fake.com",
        password: "1234",
        estimated_cycle_length: 30,
        estimated_period_length: 4,
    },
    {
        id: 2,
        first_name: "Debbie",
        last_name: "Ariyo",
        email: "dariyo@fake.com",
        password: "1234",
        estimated_cycle_length: 28,
        estimated_period_length: 5,
    },
];

const signUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError("Invalid inputs", 422);
    }

    const { first_name, last_name, email, password } = req.body;

    const newUser = {
        id: uuid(),
        first_name,
        last_name,
        email,
        password,
        estimated_cycle_length: null,
        estimated_period_length: null,
    };

    DUMMY_USERS.push(newUser);

    res.status(201).json({ user: newUser });
};

const signIn = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError("Invalid inputs", 422);
    }
    const { email, password } = req.body;

    const validUser = DUMMY_USERS.find(user => user.email === email);

    if (!validUser || validUser.password === password) {
        throw new HttpError("E-mail Address or Password Invalid", 403);
    }

    if (validUser.password === password) {
        res.status(201).json({ user: validUser });
    }
};

const getUser = (req, res, next) => {
    const userID = parseInt(req.params.uid);
    const user = DUMMY_USERS.find(u => {
        return u.id === userID;
    });
    res.json({ user });
};

const updateUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError("Invalid inputs", 422);
    }
    const userID = parseInt(req.params.uid);
    const {
        first_name,
        last_name,
        email,
        estimated_cycle_length,
        estimated_period_length,
    } = req.body;

    const userToUpdate = DUMMY_USERS.find(user => {
        return user.id === userID;
    });

    if (!userToUpdate) {
        return next(
            new HttpError("Could not update user with provided id.", 404)
        );
    }

    const userIndex = DUMMY_USERS.findIndex(user => user.id === userID);

    if (first_name) {
        userToUpdate.first_name = first_name;
    }
    if (last_name) {
        userToUpdate.last_name = last_name;
    }

    if (email) {
        userToUpdate.email = email;
    }

    if (estimated_cycle_length) {
        userToUpdate.estimated_cycle_length = estimated_cycle_length;
    }

    if (estimated_period_length) {
        userToUpdate.estimated_period_length = estimated_period_length;
    }

    DUMMY_USERS[userIndex] = userToUpdate;

    res.status(200).json({ user: userToUpdate });
};

const destroyUser = (req, res, next) => {
    const userID = parseInt(req.params.uid);

    if (DUMMY_USERS.find(user => user.id === userID)) {
        throw new HttpError("Could not find a cycle with ID", 404);
    }
    DUMMY_USERS = DUMMY_USERS.filter(user => user.id !== userID);
    res.status(200).json({ message: "User deleted" });
};

exports.signUp = signUp;
exports.signIn = signIn;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.destroyUser = destroyUser;
