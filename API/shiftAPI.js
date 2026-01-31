const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const Shift = require("../models/shiftModel")
const User = require("../models/userModel")

// Create a new shift (Manager only)
router.post("/create", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.role !== "MANAGER") {
            return res.json({ message: "Only managers can create shifts" })
        }

        const { title, date, startTime, endTime } = req.body
        if (!title || !date || !startTime || !endTime) {
            return res.json({ message: "Please provide all shift details" })
        }

        const shift = new Shift({
            title,
            date,
            startTime,
            endTime,
            createdBy: req.user
        })
        await shift.save()
        res.json({ message: "Shift created successfully", shift })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error creating shift" })
    }
})

// Get all shifts
router.get("/all", auth, async (req, res) => {
    try {
        const shifts = await Shift.find().populate("createdBy", "name email")
        res.json({ shifts })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error fetching shifts" })
    }
})

// Get available shifts (for staff to request)
router.get("/available", auth, async (req, res) => {
    try {
        const shifts = await Shift.find({ status: "AVAILABLE" }).populate("createdBy", "name email")
        res.json({ shifts })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error fetching available shifts" })
    }
})

// Get single shift by ID
router.get("/:id", auth, async (req, res) => {
    try {
        const shift = await Shift.findById(req.params.id).populate("createdBy", "name email")
        if (!shift) {
            return res.json({ message: "Shift not found" })
        }
        res.json({ shift })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error fetching shift" })
    }
})

// Update shift (Manager only)
router.put("/:id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.role !== "MANAGER") {
            return res.json({ message: "Only managers can update shifts" })
        }

        const { title, date, startTime, endTime, status } = req.body
        const shift = await Shift.findByIdAndUpdate(
            req.params.id,
            { title, date, startTime, endTime, status },
            { new: true }
        )
        if (!shift) {
            return res.json({ message: "Shift not found" })
        }
        res.json({ message: "Shift updated successfully", shift })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error updating shift" })
    }
})

// Delete shift (Manager only)
router.delete("/:id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user || user.role !== "MANAGER") {
            return res.json({ message: "Only managers can delete shifts" })
        }

        const shift = await Shift.findByIdAndDelete(req.params.id)
        if (!shift) {
            return res.json({ message: "Shift not found" })
        }
        res.json({ message: "Shift deleted successfully" })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error deleting shift" })
    }
})

module.exports = router
