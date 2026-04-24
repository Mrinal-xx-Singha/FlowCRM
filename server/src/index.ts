import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/db";
import authRoutes from "./routes/auth.route"

const app = express();
app.use(express.json())



app.get("/",(req,res)=>{
    res.send("API running")
})

app.use("/auth",authRoutes)

const startServer = async() =>{
    await connectDB()
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`);
    });
}

startServer()