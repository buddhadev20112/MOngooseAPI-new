// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.models");

const router = express.Router();
function genHashedPass(inputPass){
         let salt = bcryptjs.genSaltSync(10);
         let hash = bcryptjs.hashSync(inputPass,salt);
         return hash;
}
function verifyPass(inputPass,hashPass){
       return bcryptjs.compareSync(inputPass,hashPass) ? true : false;
   
}

// ----- CREATE ADMIN (ONE TIME) -----
async function createAdmin() {
  try {
    const adminExist = await User.findOne({ role: "admin" });
    if (adminExist) return console.log("Admin already exists");

    await User.create({
      name: "Main Admin",
      email: "admin@gmail.com",
      phone: "7407513605",
      hashPass1: bcrypt.hashSync("Admin@123", 10),
      role: "admin"
    });

    console.log("✅ Admin created successfully");
  } catch (err) {
    console.error("Error creating admin:", err.message);
  }
}
createAdmin(); // run once

// ----- LOGIN -----
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // compare password
    const isMatch = await bcrypt.compare(password, user.hashPass1);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    // generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY || "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login success",
      token,
      role: user.role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
