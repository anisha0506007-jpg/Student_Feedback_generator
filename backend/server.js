import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Feedback from "./models/feedback.js";

dotenv.config()

const app=express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("MongoDB Connected successfully");
})

.catch((error)=>{
    console.log("MongoDB connection Error", error);
});


app.post("/feedback",async(req,res)=>{
    try{
        const {name,rating,comments}=req.body;

        const newFeedback=new Feedback({
            name,
            rating,
            comments
        });

        await newFeedback.save();
        console.log("Saved:", newFeedback);
        res.status(201).json({
            message:"Feedback saved ",
            feedback:newFeedback
        });

    }catch(error){
        res.status(500).json({
            message:"Error occured",
            error: error.message
        });
    }
})

app.get("/feedback",async(req,res)=>{
    try{
        const feedbacks=await Feedback.find();

        res.status(200).json(feedbacks)
    }catch(error){
        res.status(500).json({
            message:"Error Occured in fetching feedback",
            error: error.message
        });
    }
});


app.delete("/feedback/:id",async(req,res)=>{
    try{
        const {id}=req.params
        await Feedback.findByIdAndDelete(id)
        res.json({
            message:"Feedback deleted Successfully!"
        });
    }catch(err){
        res.json({
            message:"Unbale to delete Feedback",
            error:err.message
        })
    }

})

app.put("/feedback/:id",async(req,res)=>{
    try{
        const {id}=req.params
        const{name,rating,comments}=req.body

        const updatedFeedback= await Feedback.findByIdAndUpdate(id,{
            name,rating,comments
        },{
            new:true
        });
        res.json({
            message:"Feedback updated successfully",
            feedback:updatedFeedback
        })

    }catch(error){
        res.json({
            message:"Sorry! Unable to update feedback",
            error:error.message
        })
    }
});


const PORT=process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});