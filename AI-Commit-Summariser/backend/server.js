import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import summariesRouter from "./routes/summaries.js";

const app = express();
const port = process.env.PORT || 8080;

if (!process.env.MONGODB_URL || !process.env.JWT_SECRET) {
  throw new Error("MONGODB_URL and JWT_SECRET must be configured");
}

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/summaries", summariesRouter);

async function startServer() {
  await mongoose.connect(process.env.MONGODB_URL);
  app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exitCode = 1;
});
