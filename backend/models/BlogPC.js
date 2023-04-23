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
    
const BlogPCSchema = {
    username: { 
        type: String,
         required: true ,
        minlength: 4,
        maxlength: 30},

    subject:{
        type:String,
         require:true
    },
    email:{
        type:String,
    },
    title:{
        type:String,
         require:true
    },
    content:{
        type:String,
         require:true
    },
    image:{
        type:String,
    },
    createdAt:{
        type:Date,
     }   
    
};
  
     

const BlogPC = mongoose.model(
        "BlogPC",
        BlogPCSchema
); //models defined

 module.exports={BlogPC};