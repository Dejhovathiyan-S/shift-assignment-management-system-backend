const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const Assignment = require("../models/assignmentModel")
const User = require("../models/userModel")

// Get all assignments (Manager)
router.get("/all", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.role !== "MANAGER") {
            return res.json({ message: "Only managers can view all assignments" })
        }

        const assignments = await Assignment.find()
            .populate("shift")
            .populate("assignedTo", "name email")
            .sort({ assignedOn: -1 })
        res.json({ assignments })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error fetching assignments" })
    }
})

// Get my assignments (Staff)
router.get("/my-assignments", auth, async (req, res) => {
    try {
        const assignments = await Assignment.find({ assignedTo: req.user })
            .populate("shift")
            .sort({ assignedOn: -1 })
        res.json({ assignments })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error fetching assignments" })
    }
})

// Get single assignment
router.get("/:id", auth, async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate("shift")
            .populate("assignedTo", "name email")
        if (!assignment) {
            return res.json({ message: "Assignment not found" })
        }
        res.json({ assignment })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error fetching assignment" })
    }
})

// Update assignment status (Manager)
router.put("/:id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.role !== "MANAGER") {
            return res.json({ message: "Only managers can update assignments" })
        }

        const { status } = req.body
        if (!["ACTIVE", "COMPLETED", "CANCELLED"].includes(status)) {
            return res.json({ message: "Invalid status" })
        }

        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
        if (!assignment) {
            return res.json({ message: "Assignment not found" })
        }
        res.json({ message: "Assignment updated successfully", assignment })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error updating assignment" })
    }
})

module.exports = router
