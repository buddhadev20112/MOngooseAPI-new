// const express=require("express");
// const cors=require("cors");
// const mongoose=require("mongoose");
// const env=require("dotenv").config();


// host=process.env.HOST||"127.0.0.1";
// port=process.env.PORT||3000;

// async function main() {
//     try{
//  await mongoose.connect("mongodb://127.0.0.1:27017/helloDB");
//  console.log("mongoose.connect")
//     }
//     catch(error)
//     {
//         console.log(error);
//     }

    
// }
// main()

// const usermodel=require("./models/users.model");

//  const server=express();
//  server.use(cors());
//  server.use(express.urlencoded({extended:true}));
//  server.use(express.json());

//    server.get("/",(req,res)=>{
//     res.send("<h1>welcom to mongooes</h1>");
//    });
//    server.post("/users/singup",(req,res)=>{
//     const obj=usermodel.insertOne({
//         name:req.pody.name,
//         email:req.body.email,
//         pass1:req.body.pass1,
//         phone:req.body.phone
//     })
//     res.status(200).json(obj);

//    })

// server.listen(port,host,() => {
//   console.log(` Server running at http://${host}:${port}/`);
// });