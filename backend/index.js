
const express = require("express");
const jwt = require("jsonwebtoken");
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

//database connection

mongoose
  .connect(
    "mongodb+srv://sainikhil:DBIN137411@cluster0.yvtkjnb.mongodb.net/ProfConnect"
  )
  .then(() => {
    
    console.log("DB Connection sucessful");
    app.use("/users",require("./routes/user.js"));






  });

app.get("/",(req,res)=>{
  console.log("server connected...");
  res.send("okCool")
})
app.listen(process.env.PORT || 4000, () => {
  console.log("server running in 4000");
});
//  module.exports={serverInstance};