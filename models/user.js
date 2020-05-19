const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    estimated_cycle_length: { type: Number, required: true },
    estimated_period_length: { type: Number, required: true },
    cycles: [{ type: mongoose.Types.ObjectId, required: true, ref: "Cycle" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
