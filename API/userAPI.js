require("dotenv").config()
const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
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
        if(password.length<=8){
            return res.json({"message":"password is too short minimum 8 characters required"})
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
        const isPasswordMatching = bcrypt.compare(req.body.password,user.password)
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

module.exports = router