# Quizzy O.O

A quiz REST API. Topics hold multiple-choice questions, and players can fetch a topic's questions with shuffled options and check their answers.

**Stack:** Node.js, Express 5, TypeScript, Prisma, PostgreSQL, Zod

## Setup

```bash
npm install
```

Create a `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/quizzy"
```

Apply migrations and (optionally) seed sample data:

```bash
npx prisma migrate dev
npm run seed
```

Start the server (http://localhost:6969):

```bash
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Run the server with auto-reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run seed` | Seed sample topics and questions |
| `npx tsc --noEmit` | Type-check |

## API

Base path: `/api`. Ids are UUIDs. Errors look like `{ "error": "message" }`.

### Topics
| Method | Path | Body |
|---|---|---|
| GET | `/topics` | |
| GET | `/topics/:id` | |
| POST | `/topics` | `{ "name": "Math" }` |
| PUT | `/topics/:id` | `{ "name": "Math" }` |
| DELETE | `/topics/:id` | |

### Questions
| Method | Path | Notes |
|---|---|---|
| GET | `/questions` | All questions (includes `answer`) |
| GET | `/questions/t/:topicId/q` | Questions in a topic |
| POST | `/questions/t/:topicId/q` | Create a question in a topic |
| GET | `/questions/:id` | |
| PUT | `/questions/:id` | Edit a question (topic cannot change) |
| DELETE | `/questions/:id` | |

Question body (create and update):

```json
{
  "text": "What is 2 + 2?",
  "answer": "4",
  "distractors": ["3", "5", "22"]
}
```

Rules: 3 to 10 distractors, all unique, none equal to the answer.

### Playing
| Method | Path | Notes |
|---|---|---|
| GET | `/questions/t/:topicId/play` | Returns `{ id, text, options }` with shuffled options and no `answer` |
| POST | `/questions/:id/answer` | Body `{ "answer": "4" }`, returns `{ "correct": true, "answer": "4" }` |

### Health
`GET /health` returns `{ "status": "ok" }`.

## Project structure

```
src/
  app.ts, server.ts, routes.ts
  lib/prisma.ts
  middlewares/        error handling, validation
  utils/AppError.ts
  modules/
    topics/           route, controller, service, validation
    questions/        route, controller, service, validation
prisma/               schema, migrations, seed
```
