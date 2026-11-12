import mongoose from "mongoose";

const summaryHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    githubURL: {
      type: String,
      required: true,
      trim: true,
    },
    finalSummaryArray: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
  },
  { timestamps: true }
);

summaryHistorySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("SummaryHistory", summaryHistorySchema);
