import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY?.trim();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateQuiz = async (topic) => {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const systemPrompt =
    "Hey Gemini, Act as a expert quiz generator who is expert in generating quizes and taking examinations, I am build a AI powered quiz generator full stack application, for that generate me an array of 2 quizzes related to " +
    topic +
    " in the given format { 'question': 'how many months in a year', 'option1': '10', 'option2': '12', 'option3': '8', 'option4': '6', 'correctOption': 'option2' }. don't add any boiler plate text like ```json, send directly array of objects. I am using your response to directly convert into javascript object using 'JSON.parse' so send reponse accordingly.";

  // AI calling
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: systemPrompt,
  });

  //   console.log(response.text)

  const rawText = response.text?.trim();
  if (!rawText) {
    throw new Error("Gemini returned an empty quiz response");
  }

  const jsonText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const quizArr = JSON.parse(jsonText);

  if (!Array.isArray(quizArr)) {
    throw new Error("Gemini returned an invalid quiz format");
  }

  return quizArr
};

// generateQuiz("reactjs");
