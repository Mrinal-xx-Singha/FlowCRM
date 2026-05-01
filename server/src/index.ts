import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/db";
import authRoutes from "./routes/auth.route"
import authMiddleware from "./middleware/auth.middleware";
const app = express();
app.use(express.json())


app.use("/auth",authRoutes)


app.get("/customers",authMiddleware,(req:Request,res:Response)=>{
      res.json({ user:req.user });
})


const startServer = async() =>{
    await connectDB()
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`);
    });
}

startServer()