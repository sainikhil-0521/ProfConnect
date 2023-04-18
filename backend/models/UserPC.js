
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { AlgoPC } = require("./AlgoPC");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const router=express.Router()

    
    const UserPCSchema = {
        username: { 
          type: String,
        //    required: true ,
        //   minlength: 4,
        //   maxlength: 30
        },
        email: { 
          type: String,
        //    required: true, 
        //    unique: true ,
        //   match:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        },
        password: { 
          type: String, 
        //   required: true, 
        //   unique: true,
        //   match:   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/ 
        },
        profilePic:{
          type:String,
          default:"https://houserentals-properties-upload.s3.ap-south-1.amazonaws.com/image-1680887731952.jpeg",
        },
        gender:{
            type:String,
            // enum:['male','female'],
            // require:true
        },
        dateOfBirth:{
            type:Date,
            // require:true

        },
        country:{
            type:String,
            // require:true
        },
        yearsOfExperience:{
            type:Number,
            
        },
        userType:{
            type:String,
            // enum:['free','silver','gold','admin'],
            // require:true,
            // default:'free'
        },
        matchedProfiles:{type:[{
                type: mongoose.Schema.Types.ObjectId,
                ref: "userduplicatepc" ,
                // unique:true
            }
        ],
        // default:[]
        },
        blockedProfiles:{type:[{
                type: mongoose.Schema.Types.ObjectId,
                ref: "userduplicatepc" ,
                // unique:true
            }
        ],
        // default:[]
        },
        courseType:{
            type:String,
            // require:true,
            // enum:['BTech','Integrated-MTech','MTech','BCA','BArch','BSc']
        },
        company:{
            type:String,
            // require:true,
            // default:null
        },
        companyType:{
            type:String,
            // enum:['service','product'],
            // default:null
        },
        role:{
            type:String,
            // enum:['level1','level2','level3','level4','level5'],
            // default:null
        },
        domain:{
            type:String,
            // enum:['saas','paas','iaas'],
            // default:null
        },
        isOnline:{
            type:Boolean,
            // default:false
        },
        algoId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"algoduplicatepc"
        },
        createdOn:{
            type:Date,
            default:new Date()
        } 
      };
  
     
      const UserPC = mongoose.model(
        "userduplicatepc",
        UserPCSchema
      ); //models defined

      module.exports={UserPC};
