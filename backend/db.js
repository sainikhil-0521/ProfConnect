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


mongoose
  .connect(
    "mongodb+srv://sainikhil:DBIN137411@cluster0.yvtkjnb.mongodb.net/ProfConnect"
  )
  .then(() => {
    
    console.log("DB Connection sucessful");
    
  })

  module.exports={app}