const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
    title:String,
    description:String,
    status:String,
    priority:{
        type:String,
        enum:["LOW","MEDIUM","HIGH"]
    },
    requestedOn : {
        type:Date,
        default:Date.now
    },
    actionTakenOn:Date,
    requestedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    requestedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

})

const Request = mongoose.model("Request",requestSchema)

module.exports = Request