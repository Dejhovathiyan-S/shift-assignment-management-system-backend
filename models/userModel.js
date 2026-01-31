const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    role:{
        type:String,
        enum:["STAFF","MANAGER"],
        default:"STAFF"
    },
    age:Number,
    password:String
})

const User = mongoose.model("User",userSchema) //creating a model for user schema
module.exports = User