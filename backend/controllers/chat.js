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
const router = express.Router();
const UserPC=require("../models/UserPC")
const ChatPC=require("../models/ChatPC")
const MatchPC=require("../models/MatchPC")
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let name_id=new Map()
let id_name=new Map()

console.log("ok..");
  io.on('connection', async (socket) => {
    
    let uvalue=String(socket.request._query.uname)
    console.log("user connected",uvalue,socket.id);
    await UserPC.updateOne({username:uvalue},{$set:{isOnline:true}})

    name_id.set(uvalue,socket.id)
    id_name.set(socket.id,uvalue)
    console.log(name_id,id_name);
    let msg=[]
    let matchedp=await UserPC.findOne({username:uvalue}).populate('matchedProfiles').toObject()
    
    for(let i=0;i<matchedp.matchedProfiles.length;i++){
        let obj={};
        obj.username=matchedp.matchedProfiles[i].username
        obj.image=matchedp.matchedProfiles[i].profilePic
        obj.count=0
        let p1,p2;
        p1=Math.min(matchedp._id,matchedp.matchedProfiles[i]._id)
        p2=Math.max(matchedp._id,matchedp.matchedProfiles[i]._id)
        let obj2=await MatchPC.findOne({profile1:p1,profile2:p2})
        let obj3=await  ChatPC.findOne({_id:obj2.chatId}).toObject()
        obj.messages=obj3.chat

        msg.push(obj)
    }


    
    

    
    
    io.to(socket.id).emit("initial_connection",msg)
    
    // console.log(a,socket);
    socket.on('chat message', async(msg,from,to) => {
        console.log('message: ' + msg);
        let p1,p2;
        p1=Math.min(from,to)
        p2=Math.max(from,to)
        let obj=await MatchPC.findOne({profile1:p1,profile2:p2})
        let msgg=from+"~~"+(Date.now())+"~~"+msg
        await ChatPC.updateOne({_id:obj.chatId},{$push:{chat:msgg}})

        io.to(name_id.get(to)).emit("chat message",msgg)
      });



      socket.on('chat message2',(msg)=>{
        console.log(msg);
          io.emit("chat message2",msg)
  
        })

    socket.on('disconnect',async ()=>{
      
        await UserPC.updateOne({username:id_name.get(socket.id)},{$set:{isOnline:false}})
        name_id.delete(id_name.get(socket.id))
        id_name.delete(socket.id)

        console.log(socket.id,"disconnected");
    })

     
     

  });
