const express = require("express")  
const router = express.Router()
const auth = require("../middlewares/auth")
const Request = require("../models/requestModel")

router.post("/change-request/create",
        auth, async (req,res)=>{
        
            const title = req.body.title
            const description = req.body.description
            const priority = req.body.priority
            const requestedTo = req.body.requestedTo

            if(!title || !description || !priority || !requestedTo){
                return res.json({"message":"Please provide all the details"})
            }

            const request = Request({
                title:title,
                description:description,
                status:"PENDING",
                priority: priority,
                requestedBy: req.user,
                requestedTo: requestedTo
            })
            await request.save()
            res.json({"message":"valid"})
    }
)

router.get("/change-request/user-requests", 
    auth, async(req,res)=>{
        const requests = await Request.find({requestedBy: req.user})
        res.json({"requests":requests})
    }
)

router.get("/change-request/user-pending-requests",
    auth, async(req,res)=>{
        const requests =await Request.find({requestedby:req.user,status:"PENDING"})
        res.json({"requests":requests})
    }
)

router.get("/change-request/agent-my-requests",
    auth, async(req,res)=>{
        const requests = await Request.find({requestedTo:req.user})
        res.json({"requests":requests})
    }
)

router.get("/change-request/agent-my-pending-requests",
    auth,async(req,res)=>{
        const requests = await Request.find({requestedTo:req.user,status:"PENDING"})
        res.json({"requests":requests})
    }
)

module.exports = router