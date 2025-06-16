import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./DB/db.js";
import router from "./Routes/authRoute.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/auth", router);
app.listen(port, () => {
  console.log(`Server is running on ${port} `);
  connectDB();
});
