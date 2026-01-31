const mongoose = require("mongoose")

const shiftRequestSchema = new mongoose.Schema({
    shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shift",
        required: true
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },
    reason: {
        type: String
    },
    rejectionReason: {
        type: String
    },
    requestedOn: {
        type: Date,
        default: Date.now
    },
    actionTakenOn: {
        type: Date
    }
})

const ShiftRequest = mongoose.model("ShiftRequest", shiftRequestSchema)

module.exports = ShiftRequest
