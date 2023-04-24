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
const { AlgoPC } = require("../models/AlgoPC");
const { func } = require("joi");
const { BlogPC } = require("../models/BlogPC");

const saltRounds = 8;

const biasScore = {
  courseType: 2,
  yearsOfExperience: 3,
  spam: -5,
  companyType: 5,
  domain: 4,
  level: 2,
  role:3,
};

const scores = {
  BTech: 5,
  "Integrated-MTech": 10,
  MTech: 15,
  BCA: 20,
  BArch: 25,
  BSc: 30,
  'Service-based': 10,
  'Product-based': 15,
  Others: 5,
  saas: 5,
  iaas: 10,
  paas: 15,
  Level0: 1,
  Level1: 5,
  Level2: 10,
  Level3: 15,
  Level4: 20,
  Level5: 25,
  spam: 0,
  "Software developer":5,
  "Product developer":10,
  "Senior developer":15,
  "Integration Engineer":20,
  "QA":25,
  "Sales Team  Member":30,
  "Marketing Team Member":35,
  "Payroll Team Member":40,
  "Testing Team Member":45,
  "CTO" :50,
  "COO":55,
  "CEO":60,
};

async function signup(req, res) {
  
    console.log("signup entered");
  username = req.body.username;
  email = req.body.email;
  password = req.body.password;
  cpassword = req.body.cpassword;
  if (password == cpassword) {
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      console.log(hash);
      if (!err) {
        let data = {
          email: email,
        };
        console.log("data", data);
        jwt.sign(
          data,
          process.env.SECRETKEY,
          { expiresIn: "24h" },
          async (err, token) => {
            if (err) {
              console.log("error", err);
              res.send("notok?error");
            } else {

            try{
              let user = new UserPC({
                username: username,
                email: email,
                password: hash,
              });
              console.log("signup ok1 userdet", user);
              let det = await user.save();
              console.log(det);
              console.log("jwt token", token);
              res.send({
                token: token,
                user: "valid",
                uid: det._id,
                uname: det.username,
                email: det.email,
              });

            }
            catch{
              res.send("notok?Error with username or email");
            }

            }
          }
        );
      } else {
        res.send("notok?error with password");
      }
    });
  } else {
    
    res.send("notok?password and confirm password not same");
  }
  
  
}

async function addUserDetails(req, res) {
  
  try {
    console.log("add user details");
  let obj = req.obj22;
  // if (req.file) obj.image = "../images/" + req.file.originalname;
  // console.log(obj.image);
  console.log("obj", obj, req.user);
  if (obj) {
    console.log(obj.languages);
    let check = await UserPC.updateMany(
      { email: req.user.email },
      {
        $set: {
          username:obj.username,
          gender: obj.gender,
          dateOfBirth: obj.dob,
          country: obj.country,
          yearsOfExperience: obj.experience,
          courseType: obj.coursetype,
          company: obj.company,
          companyType: obj.companytype,
          role: obj.role,
          interests:obj.interests,
          languages:obj.languages,
          level:obj.level,
          summary:obj.summary,
          domain: obj.domain,
          profilePic: obj.image,
        },
      }
    );

    let idd = await UserPC.findOne({ username: obj.username });
    let id = await AlgoPC.find({ userId: idd._id });
    
    let expScore;
    if (obj.experience <= 2) expScore = 5;
    else if (obj.experience <= 7) expScore = 10;
    else if (obj.experience <= 15) expScore = 15;
    else expScore = 20;
    

    if (id.length) {
      let totolscore =
        scores[obj.coursetype] * biasScore.courseType +
        expScore * biasScore.yearsOfExperience +
        id[0].scoreField.spam * biasScore.spam +
        scores[obj.companytype] * biasScore.companyType +
        scores[obj.domain] * biasScore.domain +
        scores[obj.level] * biasScore.level+
        scores[obj.role]* biasScore.role;
      
      await AlgoPC.updateOne(
        { _id: id[0]._id },
        {
          $set: {
            "scoreField.courseType":
              scores[obj.coursetype] * biasScore.courseType,
            "scoreField.yearsOfExperience":
              expScore * biasScore.yearsOfExperience,
            "scoreField.spam": id[0].scoreField.spam * biasScore.spam,
            "scoreField.companyType":
              scores[obj.companytype] * biasScore.companyType,
            "scoreField.domain": scores[obj.domain] * biasScore.domain,
            "scoreField.level": scores[obj.level] * biasScore.level,
            "scoreField.role": scores[obj.role] * biasScore.role,
            totalScore:totolscore
          },
        }
      );
    } else {
      let totolscore =
        scores[obj.coursetype] * biasScore.courseType +
        expScore * biasScore.yearsOfExperience +
        scores[obj.companytype] * biasScore.companyType +
        scores[obj.domain] * biasScore.domain +
        scores[obj.level] * biasScore.level+
        scores[obj.role] * biasScore.role;
      let apply={
            courseType:scores[obj.coursetype] * biasScore.courseType,
            yearsOfExperience:expScore * biasScore.yearsOfExperience,
            spam: 0,
            companyType:scores[obj.companytype] * biasScore.companyType,
            domain: scores[obj.domain] * biasScore.domain,
            level: scores[obj.level] * biasScore.level,
            role:scores[obj.role] * biasScore.role,
      }
      await AlgoPC.create(
        {
            userId:idd._id,
            scoreField:apply,
            totalScore:totolscore
          
        }
      );
    }

    console.log(check);
    res.redirect("http://127.0.0.1:5502/frontend/index.html");
  } else {
    res.send("object null");
  }
  } catch (error) {
    console.log(error);
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
async function valid(req, res) {
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
            if (err) {
              console.log("error in jwt");
              res.send(err);
            } else {
              console.log("jwt success", token);
              if (data.email == "adminprofconnect@gmail.com") {
                res.send({ user: "admin", token: token, admin: "yesyes",username:"admin" });
              } else
                res.send({ user: "valid pwd", username: uname, token: token });
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
  

  try {
    var obj = await display(req.user.email);
  if(obj){
    console.log("obj",obj);
    res.send({obj:obj,user:"valid"});
  }
  } catch (error) {
    console.log(error);
  }
}
async function blogAdd(req,res){
  try {
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
    
  } catch (error) {
    console.log(error);
  }

  

}
async function blogs(req,res){
  try {
    console.log("one user blogs loading");
    let email=req.user.email;
    var blogarr=await BlogPC.find({email:email});
    console.log("blog array",blogarr);
    res.send({obj:blogarr,user:"valid"});
  } catch (error) {
    console.log(error);
  }
    
  
}
async function allblogs(req,res){
  try {
    console.log("all blogs loading");
  let email=req.user.email;
    var blogarr=await BlogPC.find({});
    console.log("blog array",blogarr);
    res.send({obj:blogarr,user:"valid"});
  } catch (error) {
    console.log(error);
  }
  

}
async function adminblogs(req,res){
  try {
    console.log("admin blogs loading");
    let email=req.user.email;
      var blogarr=await BlogPC.find({email:"adminprofconnect@gmail.com"});
      console.log("blog array",blogarr);
      res.send({obj:blogarr,user:"valid"});
  } catch (error) {
    console.log(error);
  }
 

}


async function userType(req,res){
  let email=req.user.email;
  let doc=await UserPC.findOne({email:email})
  let result={}
  result.type=doc.userType
  if(doc.userType!="free"){
    if(doc.subscriptionEnd>(new Date())){
      result.ends=doc.subscriptionEnd;
    }
    else{
      let docc=await UserPC.findOneAndUpdate({email:email},{$set:{userType:"free"}})
      result.type="free"
    }
      
  }
  console.log(new Date());
  res.send(result)
}

async function userTypeChange(req,res){

  let email=req.user.email
  console.log(req.body.type);
  let d=new Date()
  if(req.body.type=="silver")
    d.setUTCDate(31+d.getUTCDate())
  else
    d.setUTCDate(365+d.getUTCDate())
  await UserPC.updateOne({email:email},{$set:{userType:req.body.type,subscriptionEnd:d}})

  res.send("coolthen")
}


module.exports={signup,addUserDetails,valid,profile,blogAdd,blogs,allblogs,adminblogs,userType,userTypeChange}
