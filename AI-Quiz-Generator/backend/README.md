# AI Quiz Generator API

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Configure these values in `.env`:

```env
PORT=8080
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/AI_QUIZ_GENERATOR
JWT_SECRET=use-a-long-random-string
GEMINI_API_KEY=your-gemini-api-key
```

`MONGODB_URL` is also accepted for compatibility with existing deployments. URL-encode special characters in MongoDB credentials.

## Authentication

Sign up or sign in to receive a JWT. Send it on protected requests:

```http
Authorization: Bearer <token>
```

### Sign up

`POST /api/auth/signup`

```json
{ "username": "alex", "email": "alex@example.com", "password": "secret123" }
```

### Sign in

`POST /api/auth/signin`

```json
{ "email": "alex@example.com", "password": "secret123" }
```

Both endpoints return `{ "token": "...", "user": { "id", "username", "email" } }`.

## Quizzes

### Generate a quiz

`POST /api/quizzes/generate` (protected)

```json
{ "topic": "JavaScript" }
```

Returns a topic and generated questions. Keep the questions on the client until submission.

### Save an attempt

`POST /api/quizzes/attempts` (protected)

```json
{
  "topic": "JavaScript",
  "questions": [],
  "answers": ["option1", "option3"],
  "score": 1
}
```

The API validates the submitted question and answer structure and associates the attempt with the authenticated user.

### Previous attempts

`GET /api/quizzes/attempts` (protected)

Returns the logged-in user’s attempts, newest first.

### Health

`GET /health`



prompt: 
Hey I am attaching a backend folder for my "AI Quiz Generator" application. I have installed some useful libraries you can check in package.json and I have also written the core bussiness logic, Your task is to create full fledge authenticated backend around this bussiness logic. I have not implemented db but attached the MONGODB_URL and other api in .env you can get idea of .env in .env.example.

# AI Quiz Generator API

Simple Express and MongoDB backend for the AI Quiz Generator demo. Start it with
`npm install`, create a `.env` file, then run `npm run dev` (or `npm start`).

```env
PORT=8080
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/AI_QUIZ_GENERATOR
JWT_SECRET=use_a_long_random_string
GEMINI_API_KEY=your_gemini_api_key
```

Copy the complete MongoDB Atlas connection string, including the
`mongodb+srv://` prefix. Replace `<username>` and `<password>` with the
database user's credentials. If the password contains characters such as
`@`, `:`, `/`, or `#`, URL-encode it first. Do not put spaces around `=`.

All protected routes use:

```http
Authorization: Bearer <token>
```

## Endpoints

### Sign up

`POST /api/auth/signup`

```json
{ "username": "alex", "email": "alex@example.com", "password": "secret123" }
```

Returns a `token` and basic user details.

### Sign in

`POST /api/auth/signin`

```json
{ "email": "alex@example.com", "password": "secret123" }
```

Returns a `token` and basic user details.

### Generate a quiz

`POST /api/quizzes/generate` (protected)

```json
{ "topic": "JavaScript" }
```

Returns `{ "topic": "...", "questions": [...] }`. 
Example :: {
    "topic": "React.js",
    "questions": [
        {
            "question": "What is React.js primarily used for?",
            "option1": "Building user interfaces",
            "option2": "Managing backend databases",
            "option3": "Styling web pages",
            "option4": "Writing server-side scripts",
            "correctOption": "option1"
        }
    ]
}
---
Keep the returned questions
on the frontend until the user submits the quiz.

### Save an attempt

`POST /api/quizzes/attempts` (protected)

Note: generate score on client and send back the final object

```json
{
  "topic": "JavaScript",
  "questions": [],
  "answers": ["option1", "option3"],
  "score": 4
}
```

### Get previous attempts

`GET /api/quizzes/attempts` (protected)

Returns the logged-in user's attempts, newest first.

