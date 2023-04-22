
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
            ref: "userpc" ,
            unique:true
        },
        scoreField:{
            type:{
                courseType:{type:Number},
                yearsOfExperience:{type:Number},
                spam:{type:Number},
                companyType:{type:Number},
                domain:{type:Number},
                role:{type:Number},
                level:{type:Number},
            }
        },
        totalScore:{
            type:Number
        }

 
    };
  
     

      const AlgoPC = mongoose.model(
        "algopc",
        AlgoPCSchema
      ); //models defined

      module.exports={AlgoPC};