import { Router } from "express";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { generateQuiz } from "../lib/gemini.js";
import { validateQuizQuestion } from "../utils/validation.js";

const router = Router();

router.post("/generate", async (req, res, next) => {
  try {
    const topic = typeof req.body?.topic === "string" ? req.body.topic.trim() : "";
    if (!topic || topic.length > 200) return res.status(400).json({ error: "Topic must be 1-200 characters" });

    const questions = await generateQuiz(topic);
    if (!questions.length || questions.length > 50 || !questions.every(validateQuizQuestion)) {
      return res.status(502).json({ error: "Quiz provider returned an invalid quiz" });
    }
    return res.json({ topic, questions });
  } catch (error) {
    return next(error);
  }
});

router.post("/attempts", async (req, res, next) => {
  try {
    const { topic, questions, answers, score } = req.body ?? {};
    if (
      typeof topic !== "string" ||
      !topic.trim() ||
      !Array.isArray(questions) ||
      !questions.length ||
      !questions.every(validateQuizQuestion) ||
      !Array.isArray(answers) ||
      answers.length !== questions.length ||
      !answers.every((answer) => ["option1", "option2", "option3", "option4"].includes(answer)) ||
      !Number.isInteger(score) ||
      score < 0 ||
      score > questions.length
    ) {
      return res.status(400).json({ error: "Invalid quiz attempt" });
    }

    const attempt = await QuizAttempt.create({
      user: req.userId,
      topic: topic.trim(),
      questions,
      answers,
      score,
    });
    return res.status(201).json(attempt);
  } catch (error) {
    return next(error);
  }
});

router.get("/attempts", async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.userId }).sort({ createdAt: -1 }).lean();
    return res.json(attempts);
  } catch (error) {
    return next(error);
  }
});

export default router;
