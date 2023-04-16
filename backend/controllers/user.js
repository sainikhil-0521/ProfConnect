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
const saltRounds = 8;
const router = express.Router();

const { PropertiesHR } = require("../models/propertyModel");
const { RegisteredUsersHR } = require("../models/registerModel");
const { UsersHR } = require("../models/userModel");
const { UsersTrackerHR } = require("../models/userTrackerModel");

async function addNewUser(req, res) {
  try {
    console.log(req.body);
    console.log("done adduser");
    let email = req.body.email;
    let uname = req.body.uname;
    let mobileno = req.body.mobileno;

    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      console.log(hash);
      if (!err) {
        let obj = await addUser({
          name: uname,
          email: email,
          password: hash,
          mobile: mobileno,
        });
        if(obj && email && uname && mobileno){
          let data = {
            name: uname,
            userId: obj.userId,
            email: obj.email,
            mobileno: obj.mobile,
          };
          jwt.sign(
            data,
            process.env.SECRETKEY,
            { expiresIn: "24h" },
            (err, token) => {
              console.log(token);
              res.send({ token: token ,user:"valid"});
            }
          );
        }
        else{
          res.send({user:"Invalid"})
        }
        
      } else res.send("notok");
    });
  } catch (err) {
    res.send(err);
  }
}

async function addUser(obj) {
  try {
    let userid = new UsersHR({});
    let ut = new UsersTrackerHR({ userId: userid._id });
    await ut.save();
    userid = await userid.save();
    console.log(userid);
    console.log("ok1", obj);
    let user = new RegisteredUsersHR({
      name: obj.name,
      email: obj.email,
      password: obj.password,
      mobile: obj.mobile,
      userId: userid._id,
    });
    console.log("ok2");
   // let det = await user.save();
    console.log(det);
    console.log("ok3");
    return det;
  } catch (err) {
    // res.send(err);
  }
}

async function display(name) {
  try {
    result = await RegisteredUsersHR.find({ email: name });
    console.log(result);

    return result;
  } catch (error) {
    res.send(error);
  }
}

async function valid(req, res) {
  try {
    console.log("ohh");
    var obj = await display(req.body.email);
    console.log(req.body);
    console.log(obj[0].password);
    console.log("done pwd enter");
    var email = req.body.email;
    var unameb = null;
    bcrypt.compare(req.body.password, obj[0].password, async (err, hash) => {
      console.log(hash);
      if (!hash) {
        console.log(unameb);
        res.send({ user: "Invalid pwd", token: unameb });
      } else {
        console.log("entered valid");
        unameb = obj[0].name;

        console.log(unameb);
        let data = {
          name: unameb,
          userId: obj[0].userId,
          email: obj[0].email,
          mobile: obj[0].mobile,
        };

        jwt.sign(
          data,
          process.env.SECRETKEY,
          { expiresIn: "24h" },
          (err, token) => {
            if (data.userId == "641b1f2da200c7ee16d4afa1") {
              res.send({ user: "admin", token: token, admin: "yesyes" });
            } else res.send({ user: "valid pwd", token: token });
          }
        );
      }
    });
  } catch (err) {
    res.send(err);
  }
}

async function register(req, res) {
  try {
    console.log(req.body);
    console.log("done regi");
    let email = req.body.email;
    var stat = "Invalid";
    let obj=await RegisteredUsersPC.findOne({email:email})

    if (obj.length != 0) {
      if (obj[0].email == email) {
        console.log(obj[0].email);
        stat = "valid";
        console.log(obj[0]);
      }
    }

    console.log(stat);

    // return {status:"Invalid"};
    res.send({ status: stat,statusValid:stat });
  } catch (err) {
    res.send(err);
  }
}
async function editProfile(req, res) {
  try {
    let name = req.body.name;

    jwt.verify(name, process.env.SECRETKEY, async (err, authdata) => {
      if (err) {
        res.send("not authorized");
      } else {
        console.log("user profile 1");
        let cat = req.body.cat;
        var data = {};
        if (cat == "details") {
          let name = req.body.cname;
          let email = req.body.email;
          let mobile = req.body.mobileno;

          var update1;
          if (name && email && mobile) {
            update1 = "valid";
            let update = {
              name: name,
              email: email,
              mobile: mobile,
            };
            let data = {
              name: name,
              email: email,
              mobile: mobile,
              userId: authdata.userId,
            };
            const doc = await RegisteredUsersHR.findOneAndUpdate(
              { userId: authdata.userId },
              update,
              {
                new: true,
              }
            );
            console.log("update done");
            var token1;
            jwt.sign(
              data,
              process.env.SECRETKEY,
              { expiresIn: "24h" },
              (err, token) => {
                //res.send({ user: "valid pwd", token: token });
                token1 = token;
              }
            );
            console.log(token1);
          } else {
            update1 = "invalid";
            console.log("some values are null");
          }
          var update2;
          let oldpwd = req.body.oldpwd;
          let newpwd = req.body.newpwd;
          let cnewpwd = req.body.cnewpwd;
          if (oldpwd && newpwd && cnewpwd) {
            update2 = "valid";
            const doc = await RegisteredUsersHR.findOne({
              userId: authdata.userId,
            });
            if (doc.password == oldpwd && newpwd == cnewpwd) {
              console.log("pwd change");
              const doc1 = await RegisteredUsersHR.updateOne(
                { userId: authdata.userId },
                { $set: { password: newpwd } }
              );
            } else {
              res.send("enter pwd details correctly");
            }
          } else {
            update2 = "invalid";
            console.log("passowords are null");
          }
          //var obj=RegisteredUsersHR.findOne({_id:authdata.userId});
          var doc2 = await RegisteredUsersHR.findOne({
            userId: authdata.userId,
          });
          res.send({ update1: update1, update2: update2, token: token1 });
        } else {
          console.log(authdata);
          res.send(authdata);
        }
      }
    });
  } catch (err) {
    res.send(err);
  }
}

async function userProfile(req, res) {
  try {
    let name = req.body.name;

    jwt.verify(name, process.env.SECRETKEY, async (err, authdata) => {
      if (err) {
        res.send("not authorized");
      } else {
        console.log("user profile load");
        var doc = await RegisteredUsersHR.findOne({ userId: authdata.userId });
        console.log(doc);
        if (doc) {
          res.send(doc);
        } else {
          console.log(authdata, authdata._id);
          res.send(authdata);
        }
      }
    });
  } catch (err) {
    res.send(err);
  }
}

async function requestedUsers(req, res) {
  let id = req.body.id;
  console.log(id);
  let doc = await PropertiesHR.findOne(
    { _id: id },
    { _id: 0, RequestedUsers: 1 }
  );
  console.log(doc);
  let arr = [];
  for (let i = 0; i < doc.RequestedUsers.length; i++) {
    let doc2 = await RegisteredUsersHR.findOne({
      userId: String(doc.RequestedUsers[i]),
    });
    console.log(doc2);
    let dd=new Date()
    let hdoc_date=new Date(Date.UTC(dd.getUTCFullYear(),dd.getUTCMonth(),dd.getUTCDate()));
    let hdoc = await UsersTrackerHR.aggregate([
      {
        $match: {
          userId:doc.RequestedUsers[i],
          "timespent.date": { $gte: hdoc_date },
        },
      }
    ]);
    console.log(hdoc);
    if(hdoc.length){
      doc2=doc2.toObject()
      doc2.userType="Active"
    }
    else{
      doc2=doc2.toObject()
      doc2.userType="Inactive"
    }
    
    

    arr.push(doc2);
  }
  arr.sort((x,y)=>{
    if(x.userType<y.userType) return -1;
    else return 1;
  })

  
  res.send(arr);

  console.log(arr);
}
module.exports = {
  valid,
  register,
  userProfile,
  editProfile,
  addNewUser,
  requestedUsers,
};
