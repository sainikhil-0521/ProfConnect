const passport= require("passport");

const { UserPC } = require("./models/UserPC");
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
require("dotenv").config();

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
})
 
passport.use(new GoogleStrategy({
    clientID:    process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
    callbackURL: "http://127.0.0.1:4000/google/callback",
    passReqToCallback   : true
  },
 async  function(request, accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
      console.log("hii",profile);
      
      return done(null,profile);
   // });
  }
));