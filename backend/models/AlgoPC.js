
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const router=express.Router()
    
    const AlgoPCSchema = {
       
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "UserPC" ,
            unique:true
        },
        scoreField:{
            type:{
                courseType:{type:Number,min:0,max:30},
                yearsOfExperience:{type:Number,min:0,max:20},
                spam:{type:Number,min:0,max:10},
                companyType:{type:Number,min:0,max:15},
                domain:{type:Number,min:0,max:15},
                role:{type:Number,min:0,max:25}
            }
        },
        totalScore:{
            type:Number
        }

 
    };
  
     

      const AlgoPC = mongoose.model(
        "AlgoPC",
        AlgoPCSchema
      ); //models defined

      module.exports={AlgoPC};