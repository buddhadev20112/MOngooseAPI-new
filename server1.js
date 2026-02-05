// const express=require("express");
// const cors=require("cors");
// const mongoose=require("mongoose");
// const env=require("dotenv").config();

// host=process.env.HOST||"127.0.0.1";
// port=process.env.PORT||3000;

// const server=express();
// server.use(cors());
// server.use(express.urlencoded({extended:true}));
// server.use(express.json());

//  async function mine() {
//     try{
//         await mongoose.connect("mongodb://127.0.0.1:27017/helloDB")
//         console.log("mongoose.connect")

//     }
//     catch (error){
//         console.log(error)
//     }
    
//  }
//  mine()
// server.get("/",(req,res)=>{
//     res.send("<h1> welcom o mongoose</h1>");
// });
// const usersRouter=require("./routes/users.routes");
// server.use("/users",usersRouter);

// server.listen(port,host,()=>{
//         console.log(`mongoose is http://${host}:${port}/`);
//     });
     




const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

dotenv.config();

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

const server = express();

// middlewares
server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

async function mine() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/helloDB");
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
  }
}

mine();

// test route
server.get("/", (req, res) => {
  res.send("<h1>Welcome to Mongoose</h1>");
});


// routes
const usersRouter = require("./routes/users.routes");
server.use("/users", usersRouter);
const agentRouter= require("./routes/agents.routes");
server.use("/agent",agentRouter);
const productRouter=require("./routes/product.routes");
server.use("/product",productRouter);
const adminRouter=require("./routes/admin.routes");
server.use("/admin",adminRouter);
// start server
server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});