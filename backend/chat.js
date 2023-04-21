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
const {UserPC} = require("./models/UserPC");
const {ChatPC} = require("./models/ChatPC");
const {MatchPC} = require("./models/MatchPC");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

mongoose
  .connect(
    "mongodb+srv://sainikhil:DBIN137411@cluster0.yvtkjnb.mongodb.net/ProfConnect"
  )
  .then(() => {
    console.log("DB Connection sucessful");

    let name_id = new Map();
    let id_name = new Map();

    console.log("ok..");
    console.log(UserPC);
    io.on("connection", async (socket) => {
      let uvalue = String(socket.request._query.uname);
      console.log("user connected", uvalue, socket.id);
      await UserPC.updateOne(
        { username: uvalue },
        { $set: { isOnline: true } }
      );

      name_id.set(uvalue, socket.id);
      id_name.set(socket.id, uvalue);
      console.log(name_id, id_name);
      let msg = [];
      let matchedp = await UserPC.findOne({ username: uvalue }).populate("matchedProfiles")
        console.log(matchedp);
      for (let i = 0; i < matchedp.matchedProfiles.length; i++) {
        let obj = {};
        obj.username = matchedp.matchedProfiles[i].username;
        obj.image = matchedp.matchedProfiles[i].profilePic;
        
        let p1, p2;
        if(matchedp.username<matchedp.matchedProfiles[i].username){p1=matchedp.username;p2=matchedp.matchedProfiles[i].username}
        else {p2=matchedp.username;p1=matchedp.matchedProfiles[i].username}
        
        console.log(p1,p2);
        let obj2 = await MatchPC.findOne({ profile1: p1, profile2: p2 });
        let obj3 = await ChatPC.findOne({ _id: obj2.chatId });
        obj.messages = obj3.chat;
        if(p1==uvalue)obj.count=obj2.unseen1
        else obj.count=obj2.unseen2


        msg.push(obj);
      }

      io.to(socket.id).emit("initial_connection", msg);

      // console.log(a,socket);
      socket.on("chat message", async (msg, from, to) => {
        console.log("message: " + msg);
        let p1, p2;
        if(from<to){p1=from;p2=to}
        else{ p1=to;p2=from}
        console.log(p1,p2);
        let obj = await MatchPC.findOne({ profile1: p1, profile2: p2 });
        let msgcount;
        if(p1==to) { msgcount=obj.unseen1+1;await MatchPC.updateOne({profile1:p1,profile2:p2},{$set:{unseen1:msgcount}}) }
        else { msgcount=obj.unseen2+1;await MatchPC.updateOne({profile1:p1,profile2:p2},{$set:{unseen2:msgcount}}) }

        let msgg = from + "~~" + Date.now() + "~~" + msg;
        await ChatPC.updateOne({ _id: obj.chatId }, { $push: { chat: msgg } });
        if(name_id.get(to)){
          io.to(name_id.get(to)).emit("chat message", msgg,msgcount);
        }
      });

      socket.on("chat message2", async (from,to) => {
        let p1, p2;
        if(from<to){p1=from;p2=to}
        else{ p1=to;p2=from}
        console.log(p1,p2);
        let obj = await MatchPC.findOne({ profile1: p1, profile2: p2 });
        if(p1==from) await MatchPC.updateOne({profile1:p1,profile2:p2},{$set:{unseen1:0}})
        else await MatchPC.updateOne({profile1:p1,profile2:p2},{$set:{unseen2:0}})

      });

      socket.on("disconnect", async () => {
        await UserPC.updateOne(
          { username: id_name.get(socket.id) },
          { $set: { isOnline: false } }
        );
        name_id.delete(id_name.get(socket.id));
        id_name.delete(socket.id);

        console.log(socket.id, "disconnected");
      });
    });
  });

server.listen(4050, () => {
  console.log("Listening chat...");
});
