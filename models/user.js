const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    avatar: { type: String },
    estimated_cycle_length: { type: Number },
    estimated_period_length: { type: Number },
    cycles: [{ type: mongoose.Types.ObjectId, ref: "Cycle" }],
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
