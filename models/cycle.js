const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cycleSchema = new Schema({
    is_cycle_active: { type: Boolean, required: true },
    start_date: { type: String, required: true },
    period_length: { type: Number, required: false },
    cycle_length: { type: Number, required: false },
    user_id: { type: String, required: true },
});

module.exports = mongoose.model("Cycle", cycleSchema);
