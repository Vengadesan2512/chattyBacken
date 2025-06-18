import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./DB/db.js";
import cookieParser from "cookie-parser";
import router from "./Routes/authRoute.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", router);
app.listen(port, () => {
  console.log(`Server is running on ${port} `);
  connectDB();
});
