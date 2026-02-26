require("dotenv").config()
const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const auth = require("../middlewares/auth")
const router = express.Router()
router.post("/signup",
    async(req,res)=>{
        const name=req.body.name
        const email=req.body.email
        const password=req.body.password
        const role=req.body.role
        const age=req.body.age
        if(!email || !password){
            res.json({"message":"invalid request"})
        }
        if(password.length < 5){
            return res.json({"message":"Password must be at least 5 characters"})
        }
        
        // Check for uppercase letter
        if (!/[A-Z]/.test(password)) {
            return res.json({ message: "Password must have at least one uppercase letter" })
        }
        
        // Check for lowercase letter
        if (!/[a-z]/.test(password)) {
            return res.json({ message: "Password must have at least one lowercase letter" })
        }
        
        // Check for number
        if (!/[0-9]/.test(password)) {
            return res.json({ message: "Password must have at least one number" })
        }
        
        // Check for special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.json({ message: "Password must have at least one special character" })
        }

        const userCheck = await User.findOne({email:email}) //to find one record matching findOne
        console.log("User Check: ",userCheck)
        if (userCheck){
            return await res.json({message:"user already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10)
    
        const user = new User({ //instance of user model
            name:name,
            email:email,
            password:hashedPassword,
            role:role,
            age:age
        })
        await user.save()
        res.json({"message":"success"})
})


router.post("/login",
    async(req,res)=>{
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.json({"message":"Email is invalid"})
        }
        const isPasswordMatching = await bcrypt.compare(req.body.password,user.password)
        if(!isPasswordMatching){
            return res.json({"message":"password invalid"})
        }
        const token = jwt.sign(
            {user: user._id},
            process.env.SECRET_CODE,
            {expiresIn:"1h"}
        )
        return res.json({message:"login successful", token:token})
    }
)

// Get current user info
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password")
        if (!user) {
            return res.json({ message: "User not found" })
        }
        res.json({ user })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error fetching user info" })
    }
})

// Forgot Password / Reset Password
router.put("/forgot-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body
        if (!email || !newPassword) {
            return res.json({ message: "Email and new password are required" })
        }
        if (newPassword.length < 5) {
            return res.json({ message: "Password must be at least 5 characters" })
        }
        
        // Check for uppercase letter
        if (!/[A-Z]/.test(newPassword)) {
            return res.json({ message: "Password must have at least one uppercase letter" })
        }
        
        // Check for lowercase letter
        if (!/[a-z]/.test(newPassword)) {
            return res.json({ message: "Password must have at least one lowercase letter" })
        }
        
        // Check for number
        if (!/[0-9]/.test(newPassword)) {
            return res.json({ message: "Password must have at least one number" })
        }
        
        // Check for special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            return res.json({ message: "Password must have at least one special character" })
        }
        
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.json({ message: "No account found with this email" })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        return res.json({ message: "success" })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error resetting password" })
    }
})

// Logout (client-side token removal, server acknowledgment)
router.post("/logout", auth, async (req, res) => {
    try {
        // JWT is stateless, so logout is handled client-side by removing token
        // This endpoint just confirms the logout action
        res.json({ message: "Logout successful. Please remove token from client." })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error during logout" })
    }
})

module.exports = router