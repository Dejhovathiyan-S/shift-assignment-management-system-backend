const mongoose = require("mongoose")

const assignmentSchema = new mongoose.Schema({
    shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shift",
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedOn: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
        default: "ACTIVE"
    }
})

const Assignment = mongoose.model("Assignment", assignmentSchema)

module.exports = Assignment
