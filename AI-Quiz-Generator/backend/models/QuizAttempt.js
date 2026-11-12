import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    option1: { type: String, required: true },
    option2: { type: String, required: true },
    option3: { type: String, required: true },
    option4: { type: String, required: true },
    correctOption: { type: String, required: true, enum: ["option1", "option2", "option3", "option4"] },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    topic: { type: String, required: true, trim: true, maxlength: 200 },
    questions: { type: [questionSchema], required: true },
    answers: {
      type: [String],
      required: true,
      validate: {
        validator: (answers) => answers.every((answer) => ["option1", "option2", "option3", "option4"].includes(answer)),
        message: "Answers must be valid option names",
      },
    },
    score: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
