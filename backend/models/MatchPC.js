
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
    
    const MatchPCSchema = {
       
        profile1:{
            type:String,
            require:true
        },
        profile2:{
            type:String,
            require:true
        },
        note1:{
            type:[{timestamp:Date,data:String}],
            default:[]
        },
        note2:{
            type:[{timestamp:Date,data:String}],
            default:[]
        },
        chatId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "chatduplicatepc" ,
            unique:true
        },
        unseen1:{
            type:Number,
            default:0
        },
        unseen2:{
            type:Number,
            default:0
        },
        createdOn:{
            type:Date,
            default:new Date()
        }

        
      };
  
     
      const MatchPC = mongoose.model(
        "matchduplicatepc",
        MatchPCSchema
      ); //models defined

      module.exports={MatchPC};