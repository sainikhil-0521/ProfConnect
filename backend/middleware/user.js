const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer")
const multerS3=require("multer-s3")
const aws= require("aws-sdk")
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
const saltRounds = 8;


// <<<<<----multer-s3------->>>>>>
const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_BUCKET_REGION,
  });
  
const upload = (bucketName) =>
    multer({
      storage: multerS3({
        s3,
        bucket: bucketName,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, `image-${Date.now()}.jpeg`);                         //-${Date.now()}
        },
      }),
    });

const uploadSingle = upload("houserentals-properties-upload").single('myFile');

// <<<<<----multer-s3------->>>>>>

const addUser=(req,res,next)=>{
    try{
        console.log("ok");
        console.log(req.myform,"main form");
      uploadSingle(req,res,(err) => {
        console.log("img upload done",req.file);
        if(err){
          console.log(err);
          console.log(req.file,"nikhil");
            res.send(err)
        }
        else{
            var obj={};
            obj.username=req.body.username;
            obj.email=req.body.email;
            obj.company=req.body.company;
            obj.companytype=req.body.companytype;
            obj.country=req.body.country;
            obj.experience=req.body.experience;

            obj.dob=req.body.dob;
            obj.coursetype=req.body.coursetype;
            obj.domain=req.body.domain;
            obj.role=req.body.role;
            obj.image=req.file.location;
            obj.gender=req.body.gender;

            console.log("obj",obj);
            req.obj22=obj;
            var key=req.body.key;
        jwt.verify(key,
          process.env.SECRETKEY,
          async (err,authdata)=>{
            if(err){
              console.log(err,"kavya");
              res.send("notok")
            }
            else{
              req.user=authdata;
              next();
             
            }
          })

        }

        })
    }
    catch(err){
        res.send(err);
      }

}
const auth=(req,res,next)=>{
    console.log("hello jwt auth here");
    var key=req.headers.periperi;
    console.log("key",key);
    jwt.verify(key,
        process.env.SECRETKEY,
        async (err,authdata)=>{
          if(err){
            // console.log(err,"kavya");
            res.send("notok")
          }
          else{
            console.log("ok");
            req.user=authdata;
            next();
           //res.user has email() field 
          }
    })


}
const addblog=(req,res,next)=>{
  try{
      console.log("ok add blog entered");
      console.log(req.myform,"main form");
    uploadSingle(req,res,(err) => {
      console.log("img upload done",req.file);
      if(err){
        console.log(err);
        console.log(req.file,"nikhil");
          res.send(err)
      }
      else{
          var obj={};
          obj.username=req.body.username;
          obj.subject=req.body.subject;
          obj.title=req.body.title;
          obj.content=req.body.content;
          obj.image=req.file.location;
         

          console.log("obj",obj);
          req.obj22=obj;
          var key=req.body.key;
          console.log("key",key);
      jwt.verify(key,
        process.env.SECRETKEY,
        async (err,authdata)=>{
          if(err){
            console.log(err,"kavya");
            res.send("notok")
          }
          else{
            req.user=authdata;
            next();
           
          }
        })

      }

      })
  }
  catch(err){
      res.send(err);
    }

}


module.exports={addUser,auth,addblog}