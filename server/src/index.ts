import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.get("/",(req,res)=>{
    res.send("API running")
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
