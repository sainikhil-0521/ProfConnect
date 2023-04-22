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
app.use(express.static("public"));
const bcrypt = require("bcrypt");
const { UserPC } = require("../models/UserPC");
const { func } = require("joi");
const { BlogPC } = require("../models/BlogPC");

const saltRounds = 8;

async function signup(req,res){
    console.log("signup entered");
    username=req.body.username;
    email=req.body.email;
    password=req.body.password;
    cpassword=req.body.cpassword;
      if(password==cpassword){
          
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
          console.log(hash);
          if (!err) {
          let data={
            email: email,
          }
          console.log("data",data);
          jwt.sign(
            data,
            process.env.SECRETKEY,
            { expiresIn: "24h" },
            async(err, token) => {
              if(err){
                console.log("error",err);
                res.send(err);
              }
              else{
                let user = new UserPC({
                  username: username,
                  email: email,
                  password: hash,
                });
                console.log("signup ok1 userdet",user);
                let det = await user.save();
                console.log(det);
                console.log("jwt token",token);
              res.send({ token: token ,user:"valid",uid:det._id,uname:det.username,email:det.email});
              }
              
            }
          );
          }
          else{
            res.send("notok");
          }
        }) 
      }
      else{
        alert("password and confirm password is not same!");
      }

}

async function addUserDetails(req, res) {
  console.log("add user details");
      let obj = req.obj22;
     // if (req.file) obj.image = "../images/" + req.file.originalname;
      // console.log(obj.image);
      console.log("obj",obj,req.user);
     if(obj){

     let check= await UserPC.updateMany(
        { email: req.user.email },
        {
          $set: {
            gender: obj.gender,
            dateOfBirth: obj.dob,
            country:obj.country,
            yearsOfExperience:obj.experience,
            courseType:obj.coursetype,
            company:obj.company,
            companyType:obj.companytype,
            role:obj.role,
            domain:obj.domain,
            image:obj.image,

          }
          
        }

      );
      console.log(check);
      // res.send({ ok: "ok" });
      // window.open("../")
     } 
      else{
        res.send("object null")
      }
}
async function display(name) {
  try {
    result = await UserPC.find({ email: name });
    console.log(result);

    return result;
  } catch (error) {
    res.send(error);
  }
}
async function valid(req,res){
  try {
    console.log("ohh");
    console.log(req.body);
    var obj = await display(req.body.email);
    
    console.log(obj[0].password);
    console.log("done pwd enter");
    var email = req.body.email;
    var uname = null;
    bcrypt.compare(req.body.password, obj[0].password, async (err, hash) => {
      console.log(hash);
      if (!hash) {
        console.log(uname);
        res.send({ user: "Invalid pwd", token: uname });
      } else {
        console.log("entered valid");
        uname = obj[0].username;

        console.log(uname);
        let data = {
          email: obj[0].email,
        };

        jwt.sign(
          data,
          process.env.SECRETKEY,
          { expiresIn: "24h" },
          (err, token) => {
            if(err){
              console.log("error in jwt");
              res.send(err);
            }
            else{
              console.log("jwt success",token);
              if (data.userId == "641b1f2da200c7ee16d4afa1") {
                res.send({ user: "admin", token: token, admin: "yesyes" });
              } else res.send({ user: "valid pwd", username:uname,token: token });
            }
            
          }
        );
      }
    });
  } catch (err) {
    res.send(err);
  }



}

async function profile(req,res){

  var obj = await display(req.user.email);
  if(obj){
    console.log("obj",obj);
    res.send({obj:obj,user:"valid"});
  }
}
async function blogAdd(req,res){

  console.log("blog add entered");
  var obj=req.obj22;
  var email=req.user.email;
  var blog=await BlogPC.create({
    username:obj.username,
    email:email,
    subject:obj.subject,
    title:obj.title,
    content:obj.content,
    image:obj.image,
    createdAt:new Date(),

  })
  console.log(blog);

}
async function blogs(req,res){
    console.log("one user blogs loading");
    let email=req.user.email;
    var blogarr=await BlogPC.find({email:email});
    console.log("blog array",blogarr);
    res.send({obj:blogarr,user:"valid"});
  
}
async function allblogs(req,res){
  console.log("all blogs loading");
  let email=req.user.email;
    var blogarr=await BlogPC.find({});
    console.log("blog array",blogarr);
    res.send({obj:blogarr,user:"valid"});

}


module.exports={signup,addUserDetails,valid,profile,blogAdd,blogs,allblogs}