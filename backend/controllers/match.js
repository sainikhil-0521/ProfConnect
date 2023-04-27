const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { UserPC } = require("../models/UserPC");
const { AlgoPC } = require("../models/AlgoPC");
const { MatchPC } = require("../models/MatchPC");
const { ChatPC } = require("../models/ChatPC");


async function matching(req, res) {
  try {
    console.log(req.user);

    let limit=2;
    let p=req.params.page;
    console.log(p,"pageno");
    let page=1;
    if(p>1){
      page=p;
    }
    console.log("page",page);
    let person = await UserPC.findOne({ email: req.user.email });
    let score = await AlgoPC.findOne({ userId: person._id });
    let recommend = await AlgoPC.aggregate([
      {
        $match: {
          $and: [
            { userId: { $ne: score.userId } },
            { userId: { $nin: person.blockedProfiles } },
            { userId: { $nin: person.matchedProfiles } },
            { userId: { $nin: person.requested } },
            { userId: { $nin: person.following } }
          ],
        },
      },
      {
        $addFields: {
          closeness:{$abs: { $subtract: [ score.totalScore, "$totalScore" ] }},
        }
      },
      {
        $sort: {
          closeness: 1,
        },
      },
      {
        $lookup:{
          from:"userpcs",
          localField:"userId",
          foreignField:"_id",
          as:"docs"
        }
      },{
        $project:{
          docs:1,
        }
      }
    ]).skip((page-1)*limit).limit(limit);
    
    

    console.log("recoomend",recommend);
    if(recommend.length==0){
     
      console.log("kavya");
    }

    
  
    let requested=await UserPC.findOne({ email: req.user.email },{_id:0,following:1}).populate("following");
    console.log("req",requested);
    let obj={
      requested:requested.following,
      recommend:recommend,
     
    }
    res.send(obj);
  } catch (error) {
    console.log(error);
  }
  
}


async function connecting(req, res) {
  try {
    console.log("ok3",req.body.toid);
  let connectingfrom = await UserPC.findOneAndUpdate({ email: req.user.email },{$push:{requested:req.body.toid}},{new:true});
  await UserPC.updateOne({ _id:req.body.toid },{$push:{following:connectingfrom._id}});
  console.log(connectingfrom);
  

  res.send("done")
  } catch (error) {
    console.log(error);
  }
  
}
async function sendEmail(userEmail, fname, sname, semail, srole,scompany) {
  //const { userEmail } = req.body;
  console.log("sendEmail fun entered");
  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "@ProfConnect",
      link: "https://profconnect.js/",
    },
  });

  let response = {
    body: {
      name: "! User "+fname,
      intro: "Welcome to  ProfConnect. Your Request to connect to "+sname+" is accepted!",
      table: {
        data: [
          {
            MatchedUser:sname,
            Email: semail,
            Role: srole,
            company:scompany
          },
        ],
      },
      outro: "Looking forward to find you more Professional Matches!",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: "hemalathabobba1@gmail.com",
    to: userEmail,
    subject: "Your Match has been Created.",
    html: mail,
  };
  console.log("before send mail");

  transporter
    .sendMail(message)
    .then(() => {
      console.log("you should receive an email");
      return "you should receive an email";
    })
    .catch((error) => {
      console.log("error ", error);
      return "error";
    });

  return "Signup Successfully...!";
}

async function makingmatch(req,res){
  try {
    
    console.log("ok4");
    if(req.body.toid.endsWith("accept")){
        let id=req.body.toid.split("accept")[0]
        let src=await UserPC.findOneAndUpdate({email:req.user.email},{$push:{matchedProfiles:id},$pull:{following:id}},{new:true})
        let tar=await UserPC.findOneAndUpdate({_id:id},{$push:{matchedProfiles:src._id},$pull:{requested:src._id}},{new:true})
        let cdoc=await ChatPC.create({})
        await MatchPC.create({profile1:(src.username<tar.username?src.username:tar.username),profile2:(src.username>tar.username?src.username:tar.username),chatId:cdoc._id})
        //sending an email
        await sendEmail(
          tar.email,
          tar.username,
          src.username,
          src.email,
          src.role,
          src.company
        );
  
    }
    else{
      let id=req.body.toid.split("ignore")[0]
      let src=await UserPC.findOneAndUpdate({email:req.user.email},{$push:{blockedProfiles:id},$pull:{following:id}},{new:true})
      await UserPC.findOneAndUpdate({_id:id},{$push:{blockedProfiles:src._id},$pull:{requested:src._id}})
  
    }
    
    res.send("okok")
  
  } catch (error) {
    console.log(error);
  }
 
}




module.exports = { matching,connecting,makingmatch };
