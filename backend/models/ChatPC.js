
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
    
    const ChatPCSchema = {
       
        chat:{
            type:[{type:String}],
            default:[],
            minlength:5,
        },

        

        
      };
  
     

      const ChatPC = mongoose.model(
        "ChatPC",
        ChatPCSchema
      ); //models defined

      module.exports={ChatPC};