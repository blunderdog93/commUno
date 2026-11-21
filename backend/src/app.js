import express from "express";
import morgan from "morgan";
import authRoutes from "../routes/authRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use(morgan("dev"));
app.use("/api/auth", authRoutes);

export default app;
