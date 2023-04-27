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
const router = express.Router();

const { UserPC } = require("../models/UserPC");
const { MatchPC } = require("../models/MatchPC");




async function dataDisplay(req, res) {
  let obj = {};
  let docs = await UserPC.find({
    _id: { $ne: "644386f85b10534c3173c9bd" },
  });
  obj.usersCount = docs.length;
  obj.requestsCount = 0;

  for (let i = 0; i < docs.length; i++) {
    docs[i] = docs[i].toObject();
    obj.requestsCount += docs[i].requested.length;
  }
  obj.udata = docs;

  docs = await MatchPC.find();
  obj.matchesCount = docs.length;
  obj.pdata = docs;

    let graph0 = await UserPC.aggregate([
    {
      $match:{
        email: { $ne: "adminprofconnect@gmail.com" },
      }
    },
    {
      $group: {
        _id: "$company",
        countDocs: { $count: {} }
      },
    },
  ]);
  obj.graph0 = graph0;

  let graph1 = await UserPC.aggregate([
    {
      $match:{
        email: { $ne: "adminprofconnect@gmail.com" },
      }
    },
    {
      $group: {
        _id: "$country",
        countDocs: { $count: {} },
      },
    },
  ]);
  obj.graph1 = graph1;

  let graph2 = await UserPC.aggregate([
    {
      $match:{
        email: { $ne: "adminprofconnect@gmail.com" },
      }
    },
    {
      $group: {
        _id: "$role",
        countDocs:{$count:{}}
      },
    },
  ]);
  obj.graph2 = graph2;

//   //  let graph3=await PropertiesHR.find({},{cost:1,_id:0})
//   let graph3 = await PropertiesHR.aggregate([
//     {
//       $group: {
//         _id: "$cost",
//         countDocs: { $sum: { $size: "$RequestedUsers" } },
//       },
//     },
//   ]);
//   obj.graph3 = graph3;
  res.send(obj);
}



module.exports = {dataDisplay};
