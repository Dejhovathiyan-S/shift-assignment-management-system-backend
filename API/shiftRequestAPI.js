const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const ShiftRequest = require("../models/shiftRequestModel")
const Shift = require("../models/shiftModel")
const Assignment = require("../models/assignmentModel")
const User = require("../models/userModel")

// Create shift request (Staff only)
router.post("/create", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.role !== "STAFF") {
            return res.json({ message: "Only staff can request shifts" })
        }

        const { shiftId, reason } = req.body
        if (!shiftId) {
            return res.json({ message: "Please provide shift ID" })
        }

        // Check if shift exists and is available
        const shift = await Shift.findById(shiftId)
        if (!shift) {
            return res.json({ message: "Shift not found" })
        }
        if (shift.status !== "AVAILABLE") {
            return res.json({ message: "Shift is not available" })
        }

        // Check for overlapping assignments
        const existingAssignments = await Assignment.find({ 
            assignedTo: req.user, 
            status: "ACTIVE" 
        }).populate("shift")

        for (let assignment of existingAssignments) {
            const assignedShift = assignment.shift
            if (assignedShift.date.toDateString() === new Date(shift.date).toDateString()) {
                // Check time overlap
                if (
                    (shift.startTime >= assignedShift.startTime && shift.startTime < assignedShift.endTime) ||
                    (shift.endTime > assignedShift.startTime && shift.endTime <= assignedShift.endTime) ||
                    (shift.startTime <= assignedShift.startTime && shift.endTime >= assignedShift.endTime)
                ) {
                    return res.json({ message: "You already have a shift at this time" })
                }
            }
        }

        // Check if already requested this shift
        const existingRequest = await ShiftRequest.findOne({ 
            shift: shiftId, 
            requestedBy: req.user,
            status: "PENDING"
        })
        if (existingRequest) {
            return res.json({ message: "You have already requested this shift" })
        }

        const shiftRequest = new ShiftRequest({
            shift: shiftId,
            requestedBy: req.user,
            reason
        })
        await shiftRequest.save()
        res.json({ message: "Shift request submitted successfully", shiftRequest })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error creating shift request" })
    }
})

// Get my requests (Staff)
router.get("/my-requests", auth, async (req, res) => {
    try {
        const requests = await ShiftRequest.find({ requestedBy: req.user })
            .populate("shift")
            .sort({ requestedOn: -1 })
        res.json({ requests })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error fetching requests" })
    }
})

// Get pending requests (Manager)
router.get("/pending", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.role !== "MANAGER") {
            return res.json({ message: "Only managers can view pending requests" })
        }

        const requests = await ShiftRequest.find({ status: "PENDING" })
            .populate("shift")
            .populate("requestedBy", "name email")
            .sort({ requestedOn: -1 })
        res.json({ requests })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error fetching pending requests" })
    }
})

// Approve request (Manager)
router.put("/approve/:id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.role !== "MANAGER") {
            return res.json({ message: "Only managers can approve requests" })
        }

        const shiftRequest = await ShiftRequest.findById(req.params.id)
        if (!shiftRequest) {
            return res.json({ message: "Request not found" })
        }
        if (shiftRequest.status !== "PENDING") {
            return res.json({ message: "Request already processed" })
        }

        // Update request status
        shiftRequest.status = "APPROVED"
        shiftRequest.actionTakenOn = Date.now()
        await shiftRequest.save()

        // Create assignment
        const assignment = new Assignment({
            shift: shiftRequest.shift,
            assignedTo: shiftRequest.requestedBy
        })
        await assignment.save()

        // Update shift status
        await Shift.findByIdAndUpdate(shiftRequest.shift, { status: "ASSIGNED" })

        res.json({ message: "Request approved successfully", shiftRequest, assignment })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error approving request" })
    }
})

// Reject request (Manager)
router.put("/reject/:id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.role !== "MANAGER") {
            return res.json({ message: "Only managers can reject requests" })
        }

        const { rejectionReason } = req.body
        const shiftRequest = await ShiftRequest.findById(req.params.id)
        if (!shiftRequest) {
            return res.json({ message: "Request not found" })
        }
        if (shiftRequest.status !== "PENDING") {
            return res.json({ message: "Request already processed" })
        }

        shiftRequest.status = "REJECTED"
        shiftRequest.rejectionReason = rejectionReason
        shiftRequest.actionTakenOn = Date.now()
        await shiftRequest.save()

        res.json({ message: "Request rejected", shiftRequest })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error rejecting request" })
    }
})

// Cancel request (Staff - only pending)
router.delete("/cancel/:id", auth, async (req, res) => {
    try {
        const shiftRequest = await ShiftRequest.findById(req.params.id)
        if (!shiftRequest) {
            return res.json({ message: "Request not found" })
        }
        if (shiftRequest.requestedBy.toString() !== req.user) {
            return res.json({ message: "You can only cancel your own requests" })
        }
        if (shiftRequest.status !== "PENDING") {
            return res.json({ message: "Only pending requests can be cancelled" })
        }

        await ShiftRequest.findByIdAndDelete(req.params.id)
        res.json({ message: "Request cancelled successfully" })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error cancelling request" })
    }
})

module.exports = router
