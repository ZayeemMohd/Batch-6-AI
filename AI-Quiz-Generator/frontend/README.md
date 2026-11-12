# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.







PROMPT: 
Hey, This a frontend folder in which I just initialized a empty vite react project. I want you to generate a simple frontend for my application "AI Quiz Generator". I have attacked a README.md file that contains all the backend api documentation.

keep the styling simple, use apple like simple design theme, you can import fonts from google, don't use generic boring fonts, make the application attractive.

PAGES:
- create a home page with hero section
- create a signup page and signin page
- create a generate quiz page where there should an input box and a submit button where user will enter the topic and click the submit button. also give some hints of topic below the input box.
also add a 10 min timer and as the timer completes the quiz should automatically submitted whether the user completes it or not 
- create another route for user to check his previous attemps
- the generate-quiz and see attempt quiz pages must be protected
---
check the backend documentatioin or the entire backend folder if you need that.
evaluate the results at frontend itself and then submit as mentioned in backend documentation