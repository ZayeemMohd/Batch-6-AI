import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();


console.log( process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function genAISummary(diff) {

    

  let systemPrompt =
    `You are an expert programmer, and you are trying to summarize a git commit diff.
Reminders about the git diff format:
For every file, there are a few metadata lines, like (for example):
\`\`\`
diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js
\`\`\`
This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with \`+\` means it was added.
A line that starting with \`-\` means that line was deleted.
A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
It is not part of the diff.
[...]
EXAMPLE SUMMARY COMMENTS (summary must be atleast 3 points):
\`\`\`
* Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
* Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
* Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
* Added an OpenAI API for completions [packages/utils/apis/openai.ts]
* Lowered numeric tolerance for test files
\`\`\`
Most commits will have less comments than this examples list.
The last comment does not include the file names,
because there were more than two relevant files in the hypothetical commit.
Do not include parts of the example in your summary.
It is given only as an example of appropriate comments. ` +
    `Please summarise the following diff file: \n\n${diff}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: systemPrompt,
  });

//   console.log(response.text)
  return response.text;
}


// genAISummary(`diff --git a/frontend.js b/frontend.js
// index 774a780..b5e4027 100644
// --- a/frontend.js
// +++ b/frontend.js
// @@ -1 +1,5 @@
// +// This is a file to create the frontend
// +//We will create the frontend here
// +
// +//We are writing PDF viewer functionality
//  const pdfviewer = pdf();`)