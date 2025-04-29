// import express from 'express';
import "dotenv/config";
import connectdb from "../database.js";
import { app } from "./app.js";
const PORT = process.env.port || 5000;

// import {
//     registerUser, loginUser, logoutUser, refreshAccessToken
// } from "../controllers/user.controller.js"

// app.use(cors());
// app.use(express.json());

connectdb()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server Running at",{PORT});
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

// app.get("/", (req,response)=>{
//     response.send("AURA");
// })
// app.post("/register", (req,response)=>{
//     registerUser
// })

// app.listen(PORT, ()=>{
//     console.log("Server Running");
// })
