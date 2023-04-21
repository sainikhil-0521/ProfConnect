
const express = require("express");
const jwt = require("jsonwebtoken");
const passport= require("passport");
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



const cookieSession = require('cookie-session');
const { UserPC } = require("./models/UserPC");
require("./passportuser")
//database connection
 
mongoose
  .connect(
    "mongodb+srv://sainikhil:DBIN137411@cluster0.yvtkjnb.mongodb.net/ProfConnect"
  )
  .then(() => {
    
    console.log("DB Connection sucessful");
    
  })

  app.use("/users",require("./routes/user"))
  app.use("/match",require("./routes/match"))
  
  app.get("/",(req,res)=>{
    console.log("server working");
    res.send("coolDude")
  })


app.listen(process.env.PORT || 4000, () => {
  console.log("server running in 4000");
});


//---------------------->>google sign in apis<<---------------------------------

app.use(cookieSession({
  name: 'SandBox-session',
  keys: ['key1', 'key2']
}))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
}

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.send('Example Home page!'))
app.get('/failed', (req, res) => res.send('Something went wrong ,You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome  ${req.user.displayName}!`))

app.get('/google',
passport.authenticate('google', { scope:
  [ 'email', 'profile' ] }
));


app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  async function(req, res) {
    // Successful authentication, redirect home.
    console.log("user",req.user);
    var isfirst;
      let userprofile=req.user
      if(await UserPC.findOne({email:userprofile._json.email}))
      {
          isfirst="false";
      }
      else{
       var user= await UserPC.create({
          googleId:userprofile.id,
          email:userprofile._json.email,
          username:String(userprofile.displayName).replace(/ /g,"_"),
          profilePic:userprofile._json.picture

        })
        isfirst="true";
        console.log("user created",user);
      }
    var emp=await UserPC.findOne({email:req.user._json.email})
    let data={
      email:emp.email
    }
    var token2;
    jwt.sign(
      data,
      process.env.SECRETKEY,
      { expiresIn: "24h" },
      async(err, token) => {
        if(err){
          console.log("error in jwt",err);
          res.send(err);
        }
        else{
          token2=token;
          console.log(token2);
          res.redirect(`http://127.0.0.1:5502/frontend/index.html?${token2}?${isfirst}?${emp.username}?${emp.email}`);
        }
      }
    )
    
  }
);


app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('');
})

//---------------------->>google sign in apis<<---------------------------------

//  module.exports={serverInstance};