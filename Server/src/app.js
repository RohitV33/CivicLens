import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import issueRoutes from "./routes/issue.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use("/api/issues", issueRoutes);

export default app;