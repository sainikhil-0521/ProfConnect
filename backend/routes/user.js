
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { signup, addUserDetails, valid, profile, blogAdd, blogs, allblogs, adminblogs,userType ,userTypeChange} = require("../controllers/user");
const { addUser ,auth, addblog} = require("../middleware/user");
// const { profilePic } = require("../controllers/multer");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const router=express.Router()




router.post("/signup",signup);
 router.post("/addUserDetails",addUser,addUserDetails);
router.post("/valid",valid);
router.post("/profile",auth,profile);
router.post("/blogs",auth,blogs);
router.post("/addblog",addblog,blogAdd);
router.post("/allblogs",auth,allblogs);
router.post("/userType",auth,userType);
router.post("/userTypeChange",auth,userTypeChange);
router.post("/adminblogs",auth,adminblogs);
// router.post("/editData",editProfile);

module.exports =router;