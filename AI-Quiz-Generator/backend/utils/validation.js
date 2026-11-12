export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateQuizQuestion = (question) =>
  question &&
  typeof question.question === "string" &&
  question.question.trim().length > 0 &&
  ["option1", "option2", "option3", "option4"].every(
    (option) => typeof question[option] === "string" && question[option].trim()
  ) &&
  ["option1", "option2", "option3", "option4"].includes(question.correctOption);
