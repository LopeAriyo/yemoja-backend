const uuid = require("uuid/v4");
const HttpError = require("../models/http-error");

const DUMMY_USERS = [
    {
        id: 1,
        first_name: "Lope",
        last_name: "Ariyo",
        email: "lariyo@fake.com",
        password: "1234",
    },
    {
        id: 2,
        first_name: "Debbie",
        last_name: "Ariyo",
        email: "dariyo@fake.com",
        password: "1234",
    },
];

const signUp = (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;

    const newUser = { id: uuid(), first_name, last_name, email, password };

    DUMMY_USERS.push(newUser);

    res.status(201).json({ user: newUser });
};

const signIn = (req, res, next) => {
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

exports.signUp = signUp;
exports.signIn = signIn;
exports.getUser = getUser;
