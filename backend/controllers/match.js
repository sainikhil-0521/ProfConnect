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
const { UserPC } = require("../models/UserPC");
const { AlgoPC } = require("../models/AlgoPC");
const { MatchPC } = require("../models/MatchPC");
const { ChatPC } = require("../models/ChatPC");


async function matching(req, res) {
  console.log(req.user);
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
  ]);
  
  
  console.log(recommend);

  let requested=await UserPC.findOne({ email: req.user.email },{_id:0,following:1}).populate("following");
  console.log("req",requested);
  let obj={
    requested:requested.following,
    recommend:recommend
  }
  res.send(obj);
}


async function connecting(req, res) {
  console.log("ok3",req.body.toid);
  let connectingfrom = await UserPC.findOneAndUpdate({ email: req.user.email },{$push:{requested:req.body.toid}},{new:true});
  await UserPC.updateOne({ _id:req.body.toid },{$push:{following:connectingfrom._id}});
  console.log(connectingfrom);
  

  res.send("done")
}

async function makingmatch(req,res){
  console.log("ok4");
  if(req.body.toid.endsWith("accept")){
      let id=req.body.toid.split("accept")[0]
      let src=await UserPC.findOneAndUpdate({email:req.user.email},{$push:{matchedProfiles:id},$pull:{following:id}},{new:true})
      let tar=await UserPC.findOneAndUpdate({_id:id},{$push:{matchedProfiles:src._id},$pull:{requested:src._id}},{new:true})
      let cdoc=await ChatPC.create({})
      await MatchPC.create({profile1:(src.username<tar.username?src.username:tar.username),profile2:(src.username>tar.username?src.username:tar.username),chatId:cdoc._id})


  }
  else{
    let id=req.body.toid.split("ignore")[0]
    let src=await UserPC.findOneAndUpdate({email:req.user.email},{$push:{blockedProfiles:id},$pull:{following:id}},{new:true})
    await UserPC.findOneAndUpdate({_id:id},{$push:{blockedProfiles:src._id},$pull:{requested:src._id}})

  }
  res.send("okok")

}




module.exports = { matching,connecting,makingmatch };
