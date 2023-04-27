
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { signup, addUserDetails, valid } = require("../controllers/user");
const { addUser ,auth} = require("../middleware/user");
const { matching,connecting,makingmatch } = require("../controllers/match");
// const { profilePic } = require("../controllers/multer");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const router=express.Router()



router.get("/matched/:page",auth,matching);
router.post("/connect",auth,connecting);
router.post("/makeamatch",auth,makingmatch);

// router.post("/editData",editProfile);

module.exports =router;