const { validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const normalize = require("normalize-url");

const config = require("config");
const HttpError = require("../models/http-error");
const User = require("../models/User");

const signUp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs", 422));
    }

    const { first_name, last_name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        const error = new HttpError("Sign up failed", 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            "User already exists, please sign in instead",
            422
        );
        return next(error);
    }

    const avatar = normalize(
        gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm",
        }),
        { forceHttps: true }
    );

    let salt;
    let hashedPassword;

    try {
        salt = await bcrypt.genSalt(12);
        hashedPassword = await bcrypt.hash(password, salt);
    } catch (err) {
        const error = new HttpError(
            "Creating password failed, please try again.",
            500
        );
        return next(error);
    }

    const newUser = new User({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        avatar,
        estimated_cycle_length: 30,
        estimated_period_length: 5,
        cycles: [],
    });

    try {
        await newUser.save();
    } catch (err) {
        const error = new HttpError("Sign up failed, please try again.", 500);
        return next(error);
    }

    const payload = {
        user: {
            id: newUser.id,
        },
    };

    let token;
    try {
        token = jwt.sign(payload, config.get("jwtSecret"), {
            expiresIn: "4 days",
        });
    } catch (err) {
        const error = new HttpError(
            "Signing up failed, please try again later.",
            500
        );
        return next(error);
    }

    res.status(201).json({
        user: newUser.toObject({ getters: true }).id,
        token: token,
    });
};

const signIn = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs", 422));
    }

    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError("Sign in failed", 500);
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError("E-mail Address or Password Invalid", 401);
        return next(error);
    }

    res.status(201).json({ user: existingUser.toObject({ getters: true }) });

    // res.status(201).json({ message: `${existingUser.email} now signed in` });
};

const getUserByID = async (req, res, next) => {
    const userID = req.params.uid;

    let user;

    try {
        user = await User.findById(userID, "-password");
    } catch (err) {
        const error = new HttpError("Unable to find user", 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            "Could not find a user with the provided id.",
            404
        );
        return next(error);
    }

    res.json({
        user: user.toObject({ getters: true }),
    });
};

// const updateUser = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         console.log(errors);
//         throw new HttpError("Invalid inputs", 422);
//     }
//     const userID = req.params.uid;
//     const {
//         first_name,
//         last_name,
//         email,
//         estimated_cycle_length,
//         estimated_period_length,
//     } = req.body;

//     const userToUpdate = DUMMY_USERS.find(user => {
//         return user.id === userID;
//     });

//     if (!userToUpdate) {
//         return next(
//             new HttpError("Could not update user with provided id.", 404)
//         );
//     }

//     const userIndex = DUMMY_USERS.findIndex(user => user.id === userID);

//     if (first_name) {
//         userToUpdate.first_name = first_name;
//     }
//     if (last_name) {
//         userToUpdate.last_name = last_name;
//     }

//     if (email) {
//         userToUpdate.email = email;
//     }

//     if (estimated_cycle_length) {
//         userToUpdate.estimated_cycle_length = estimated_cycle_length;
//     }

//     if (estimated_period_length) {
//         userToUpdate.estimated_period_length = estimated_period_length;
//     }

//     DUMMY_USERS[userIndex] = userToUpdate;

//     res.status(200).json({ user: userToUpdate });
// };

const destroyUser = async (req, res, next) => {
    const userID = req.params.uid;

    let user;

    try {
        user = await User.findById(userID);
    } catch (err) {
        const error = new HttpError("Unable to find user to delete", 500);
        return next(error);
    }

    try {
        await user.remove();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, unable to delete",
            500
        );
        return next(error);
    }

    res.status(200).json({ message: "User deleted" });
};

exports.signUp = signUp;
exports.signIn = signIn;
exports.getUserByID = getUserByID;
// exports.updateUser = updateUser;
exports.destroyUser = destroyUser;
