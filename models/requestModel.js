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

app.post("/change-request/create",
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

app.get("/change-request/user-requests", 
    auth, async(req,res)=>{
        const requests = await Request.find({requestedBy: req.user})
        res.json({"requests":requests})
    }
)

app.get("change-request/user-pending-requests",
    auth, async(req,res)=>{
        const requests =await Request.find({requestedby:req.user,status:"PENDING"})
        res.json({"requests":requests})
    }
)

app.get("change-request/agent-my-requests",
    auth, async(req,res)=>{
        const requests = await Request.find({requestedTo:req.user})
        res.json({"requests":requests})
    }
)

app.get("change-request/agent-my-pending-requests",
    auth,async(req,res)=>{
        const requests = await Request.find({requestedTo:req.user,status:"PENDING"})
    }
)