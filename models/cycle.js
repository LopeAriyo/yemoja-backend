const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cycleSchema = new Schema({
    is_cycle_active: { type: Boolean, required: true },
    start_date: { type: String, required: true },
    cycle_length: { type: Number, required: true },
    period_length: { type: Number, required: true },
    user_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Cycle", cycleSchema);
