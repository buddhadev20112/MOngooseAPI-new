const express = require('express');
const agentRouter = express.Router();
const userModel   = require("../models/user.models"); 
const agent = require("../agents/agent.ai");


agentRouter.post("/show/",async(req,res)=>{
          const response = await agent(req.body.message);
         const userObj = await userModel.findOne({"_id":response});
       if(!userObj)
         res.status(200).json({"message":"no such user's exists"});
       else 
         res.status(200).json(userObj);
});
agentRouter.get("/all/:param",async(req,res)=>{
       const response = await agent(req.params.param);
       if(response == "all"){
            const users =  await userModel.find({});
            res.status(200).json(users); 
       }
});
agentRouter.post("/",async(req,res)=>{
    const response = await agent(req.body.message);
    res.status(200).json({"Agent says :":response});
    
});
agentRouter.post("/signup",async(req,res)=>{
    data =  await agent(req.body.message);
   // res.status(200).json(data);
     try{ 
    const obj= await userModel.insertOne(data);
       if(!obj)
           res.status(403).json({"Agent Says:":"Unable to Signup"});
        else 
            res.status(200).json({"Agent Says:":"signup success","data":obj});
    }
    catch(error){
          res.status(200).json(error?.message);
    }

  });
  agentRouter.post("/agent/signin",async(req,res)=>{
      const response = await agent(req.body.message);
      //res.status(200).json(response);
      const user =await userModel.find({
        $and:[
          {email:response?.email},
          {pass1:response?.pass1}
        ]
      });
      if(!user[0]){
        res.status(200).json({"Agent Says:":"Invalid username or Password"});

      }else{
      res.status(200).json({"Agent Says:":"Login Successfull","user":user[0]});
      }
});

module.exports = agentRouter;
console.log("Agent Router is working");
