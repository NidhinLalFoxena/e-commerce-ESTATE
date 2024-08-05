import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
/*MONGO="mongodb+srv://lalnidhinp02:Nidhin%402020@cluster0.sa4gaet.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET='iasdfhuafiahjf'
 */

dotenv.config();

console.log(process.env.MONGO);

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err.message, "Error connecting to MongoDB");
  });
const app = express();
app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server started on port 300!!!0");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, statusCode, message });
});
