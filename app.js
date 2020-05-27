const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Models
const HttpError = require("./models/http-error");

//Routes
const usersRoutes = require("./routes/users");
const cyclesRoutes = require("./routes/cycles");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

app.use("/api/users", usersRoutes);
app.use("/api/cycles", cyclesRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Route not found", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
    .connect(
        "mongodb+srv://lope:1nPTxhYjPPgJVZep@cluster0-s7rff.mongodb.net/mern?retryWrites=true&w=majority"
    )
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });
