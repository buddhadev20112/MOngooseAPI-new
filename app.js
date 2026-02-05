// const express=require("express")
// const cors=require("cors");
// const mongoose=require("mongoose");
// require("dotenv").config();


// const host=process.env.HOST;
// const port=process.env.PORT;

// const app=express();
// app.use(cors());
// app.use(express.json());

// const login=require("./models/login")

//  async function mine() {
//     try{
//          await mongoose.connect("mongodb://127.0.0.1:27017/helloDB");
//     console.log("mongoose is mongoose connection");

//     }
//     catch(error){
//         console.log(error);
//     }
   
    
// };
// mine();


// app.get("/",(req,res)=>{
//     res.send("<h1>b welcom to mongoose</h1>")
// });
// app.post("/signup",async(req,res)=>{
//     try{
//           const obj=await login.create({
//         name:req.body.name,
//         email:req.body.email,
//         pass1:req.body.pass1,
//         phone:req.body.phone
//     })
//     res.status(200).json(obj);

//     }
//     catch(error)
//     {
//         res.status(2000).json("error");
//     }
  
    
// })
// app.listen(port,host,()=>{
//     console.log(`welcom to http://${host}:${port}/`);
// })
