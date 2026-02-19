import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app : Application = express();
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.get("/", (req: Request, res: Response) => {
        res.status(200).json({
        success: true,
        message: "ChatMe API is running 🚀",
    });
});

app.use((req: Request, res: Response) => {
        res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

export default app;