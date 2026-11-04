# Quizzy API

Base URL: `http://localhost:<PORT>` (all resource routes are under `/api`). JSON in, JSON out. No authentication.

## Conventions

- Ids are UUIDs. A malformed id returns `400`.
- Errors always have the shape `{ "error": "<message>" }`.
- Validation errors report only the first issue, as `"<path>: <message>"`.

| Status | Meaning |
| --- | --- |
| 200 | OK |
| 201 | Created |
| 400 | Validation failed (body or malformed UUID) |
| 404 | Resource not found, or no route for that method and path |
| 500 | Unexpected server error |

## Models

**Topic**

```json
{ "id": "uuid", "name": "string" }
```

**Question** (admin view, includes the answer)

```json
{
  "id": "uuid",
  "text": "string",
  "answer": "string",
  "distractors": ["string"],
  "topicId": "uuid"
}
```

**PlayQuestion** (player view, never includes `answer`)

```json
{ "id": "uuid", "text": "string", "options": ["string"] }
```

## Health

### `GET /health`

Returns `200 { "status": "ok" }`. Not under `/api`.

## Topics

Body for create and update:

| Field | Type | Rules |
| --- | --- | --- |
| `name` | string | trimmed, 1–100 chars, unique |

| Method | Path | Body | Success | Errors |
| --- | --- | --- | --- | --- |
| GET | `/api/topics` | – | 200 `Topic[]` (sorted by name) | – |
| GET | `/api/topics/:id` | – | 200 `Topic` | 400, 404 |
| POST | `/api/topics` | `{ name }` | 201 `Topic` | 400 |
| PUT | `/api/topics/:id` | `{ name }` | 200 `Topic` | 400, 404 |
| DELETE | `/api/topics/:id` | – | 200 deleted `Topic` | 400, 404 |

## Questions (admin)

Body for create and update:

| Field | Type | Rules |
| --- | --- | --- |
| `text` | string | trimmed, 1–1000 chars |
| `answer` | string | trimmed, 1–255 chars |
| `distractors` | string[] | 3–10 items, each trimmed 1–255 chars, unique, must not include `answer` |

```json
{
  "text": "Capital of France?",
  "answer": "Paris",
  "distractors": ["Lyon", "Marseille", "Nice"]
}
```

| Method | Path | Body | Success | Errors |
| --- | --- | --- | --- | --- |
| GET | `/api/questions` | – | 200 `Question[]` | – |
| GET | `/api/questions/:id` | – | 200 `Question` | 400, 404 |
| GET | `/api/questions/t/:topicId/q` | – | 200 `Question[]` for the topic | 400, 404 (topic) |
| POST | `/api/questions/t/:topicId/q` | question body | 201 `Question` | 400, 404 (topic) |
| PUT | `/api/questions/:id` | question body | 200 `Question` | 400, 404 |
| DELETE | `/api/questions/:id` | – | 200 deleted `Question` | 400, 404 |

A question cannot be moved to another topic: `PUT` ignores `topicId`.

## Player

### `GET /api/questions/t/:topicId/play`

Returns every question in the topic with shuffled options. Must be a **GET**; other methods return 404.

```json
[
  { "id": "uuid", "text": "Capital of France?", "options": ["Nice", "Paris", "Lyon", "Marseille"] }
]
```

Errors: `400` malformed `topicId`, `404` topic not found.

### `POST /api/questions/:id/answer`

Body: `{ "answer": "string" }` (trimmed, 1–255 chars). `:id` is the **question** id.

```json
{ "correct": true, "answer": "Paris" }
```

Errors: `400` invalid body or id, `404` question not found.

## Known edge cases

- Creating or renaming a topic to an existing name violates the unique constraint and currently returns `500`.
- Deleting a topic that still has questions fails on the foreign key and currently returns `500`. Delete its questions first.
- `answer` matching in `/answer` is an exact, case-sensitive string comparison.
