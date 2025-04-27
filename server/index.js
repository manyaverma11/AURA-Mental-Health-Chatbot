import express from 'express';
import "dotenv/config"
import connectdb from './database.js';
const app = express();
const PORT = process.env.port || 3000;

app.use(cors());
app.use(express.json());

connectdb();

app.get("/", (req,response)=>{
    response.send("AURA");
})

app.listen(PORT, ()=>{
    console.log("Server Running");
})
