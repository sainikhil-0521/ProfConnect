const express = require("express");
const jwt = require("jsonwebtoken");
const passport= require("passport");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const app=express()
const bodyParser = require("body-parser");
const multer = require("multer");
const bcrypt=require("bcrypt")
const saltRounds=8
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// mongoose
//   .connect(
//     "mongodb+srv://sainikhil:DBIN137411@cluster0.yvtkjnb.mongodb.net/ProfConnect"
//   )
//   .then(() => {
    
//     console.log("DB Connection sucessful");
    
//   })
  app.use("/users",require("./routes/user"))
  app.use("/match",require("./routes/match"))
  app.use("/admin",require("./routes/admin"))
  
  app.get("/",(req,res)=>{
    console.log("server working");
    res.send("coolDude")
  })

  module.exports={app}