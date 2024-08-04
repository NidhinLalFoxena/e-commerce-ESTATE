import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 10000, // Timeout in milliseconds
//   socketTimeoutMS: 45000, // Timeout for operations in milliseconds
// };

mongoose
  .connect(
    "mongodb+srv://lalnidhinp02:Nidhin%402020@cluster0.sa4gaet.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err.message, "Error connecting to MongoDB");
  });
const app = express();
app.use(express.json());

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
