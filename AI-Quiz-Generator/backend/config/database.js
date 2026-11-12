import mongoose from "mongoose";

export const connectDatabase = async () => {
  const uri = (process.env.MONGODB_URI || process.env.MONGODB_URL)?.trim();
  if (!uri) {
    throw new Error("MONGODB_URI or MONGODB_URL is not configured");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
};
