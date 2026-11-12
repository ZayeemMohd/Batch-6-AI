import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDatabase } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import quizRoutes from "./routes/quizzes.js";
import { authenticate } from "./utils/auth.js";

const app = express();
const port = Number(process.env.PORT) || 8080;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", authenticate, quizRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

const start = async () => {
  await connectDatabase();
  app.listen(port, () => console.log(`Server is listening on port ${port}`));
};

start().catch((error) => {
  console.error("Unable to start server:", error.message);
  process.exitCode = 1;
});

export default app;
