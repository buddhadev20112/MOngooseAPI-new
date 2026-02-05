const express = require('express'); 
const userModel = require('../models/user.models');
const userRouter = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

const FIXED_ADMIN = {
    email: "admin@gmail.com",
    password: "Admin@123",
    role: "admin"
};
function genHashedPass(inputPass){
    let salt = bcryptjs.genSaltSync(10);
    let hash = bcryptjs.hashSync(inputPass,salt);
    return hash;
}
function verifyPass(inputPass,hashPass){
    return bcryptjs.compareSync(inputPass,hashPass) ? true : false;
}

// Get all users
userRouter.get("/all", async (req,res)=>{
    const users =  await userModel.find({});
    res.status(200).json(users);
});

// Get single user
userRouter.get("/show/:uid", async(req,res)=>{
    let uid = req.params.uid;
    const userObj = await userModel.findOne({"_id":uid});
    if(!userObj)
        res.status(200).json({"message":"No such user exists"});
    else
        res.status(200).json(userObj);
});

// Signup
userRouter.post("/signup", async(req,res)=>{
    try{
        const obj = await userModel.create({
            name : req.body.name,
            email: req.body.email,
            pass1: req.body.pass1,
            hashPass1: genHashedPass(req.body.pass1),
            phone: req.body.phone,
        });
        if(!obj)
            res.status(403).json({"message":"Unable to Signup"});
        else
            res.status(200).json({"message":"Signup success","data":obj});
    }
    catch(error){
        res.status(200).json(error?.message);
    }
});

// Signin / Login
userRouter.post("/login", async(req,res)=>{
    const { email, pass1 } = req.body;

    // --- Check fixed admin first ---
    if(email === FIXED_ADMIN.email && pass1 === FIXED_ADMIN.password){
        const token = jwt.sign({email: FIXED_ADMIN.email, role: FIXED_ADMIN.role}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({
            message: "Admin Login Success",
            user: { email: FIXED_ADMIN.email, role: FIXED_ADMIN.role },
            token
        });
    }

    // --- Check regular MongoDB users ---
    try{
        const userObj =  await userModel.findOne({email});
        if(!userObj){
            return res.status(200).json({"message":"No such user registered with us"});
        } else {
            let user_hash_pass = userObj.hashPass1;
            if(verifyPass(pass1,user_hash_pass)){
                const token = jwt.sign({user_id:userObj._id}, process.env.JWT_SECRET_KEY, { expiresIn:'1h' });
                return res.status(200).json({"message":"Login Success","user":userObj, token});
            } else {
                return res.status(200).json({"message":"Invalid username or password"});
            }
        }
    }
    catch(error){
        res.status(403).json({"error":error?.message});
    }
});

module.exports = userRouter;
console.log("User Router is working");
