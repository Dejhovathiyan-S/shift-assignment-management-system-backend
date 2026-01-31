const mongoose = require("mongoose")

const shiftSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["AVAILABLE", "ASSIGNED"],
        default: "AVAILABLE"
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})

const Shift = mongoose.model("Shift", shiftSchema)

module.exports = Shift
