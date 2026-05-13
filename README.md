# Chill Sessions

An AI-powered mental health support chatbot built for Gen Z. Chill Sessions provides peer-style emotional support through natural conversation, informed by evidence-based therapeutic frameworks (CBT, DBT, ACT, mindfulness), with built-in crisis detection and safety guardrails.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [AI Provider Options](#ai-provider-options)
- [API Reference](#api-reference)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Schema](#database-schema)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Important Disclaimer](#important-disclaimer)

---

## Overview

Chill Sessions is a full-stack web application that connects users to an AI companion for emotional support. The app is deliberately designed for Gen Z — casual language, zero friction to start, no sign-up forms, and no waiting lists.

The AI is not presented as a licensed therapist. It is transparent about being software, defers to professionals for serious issues, and surfaces crisis resources (NIMHANS helpline, iCall) whenever distress signals are detected. All conversations are anonymous and session-scoped.

---

## Features

### Core Chat Experience
- Zero-friction onboarding: type a name (optional) and start talking immediately
- Persistent session-based conversation history stored in SQLite
- AI remembers the last 10 messages of context within a session
- Paginated message retrieval for long conversations

### AI Behavior
- Warm, direct conversational tone — not clinical, not lecture-y
- Evidence-based framing: responses reference CBT, DBT, ACT, and mindfulness concepts where relevant
- Dynamic research context injection: when users mention topics like anxiety, depression, or specific therapies, the system prompt is enriched with established academic references
- Keyword-based sentiment analysis classifies each message as positive/neutral/negative with urgency scoring (low/medium/high)
- Topic extraction identifies themes: academic stress, family issues, relationships, work/career, financial stress

### Safety and Crisis Detection
- Urgent keyword detection (`suicidal`, `hurt myself`, `end it all`, etc.) triggers high-urgency classification
- The AI is instructed to immediately surface crisis helplines on distress signals:
  - NIMHANS: 080-46110007
  - iCall: 9152987821
- The AI always identifies itself as software, never claims to be a licensed clinician

### Multi-Provider LLM Routing
- Switchable AI backend via a single environment variable (`AI_PROVIDER`)
- Supports: Groq (Llama 3.1), OpenAI (GPT-3.5-turbo), Hugging Face (DialoGPT), and local Ollama
- Graceful fallback responses on API errors or rate limits

### Frontend UX
- Landing page with hero section, feature highlights, chat preview, and CTA
- "How It Works" modal explaining the AI's nature and limitations
- Crisis support panel with NIMHANS contact always visible
- Fully responsive, mobile-first layout
- Dark-themed UI built with Tailwind CSS and Radix UI primitives

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| Radix UI | Accessible, unstyled UI primitives |
| shadcn/ui | Pre-built component library on top of Radix |
| React Router v6 | Client-side routing |
| TanStack Query v5 | Server state management |
| React Hook Form + Zod | Form handling and validation |
| Lucide React | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| Node.js (>=18) | Runtime |
| Express 4 | HTTP server framework |
| TypeScript | Type safety |
| SQLite3 | Embedded database, zero config |
| Joi | Request validation |
| Helmet | HTTP security headers |
| express-rate-limit | Rate limiting |
| cors | Cross-origin resource sharing |
| compression | Gzip response compression |
| Pino | Structured JSON logging |
| tsx | TypeScript execution for dev |

### AI Providers

| Provider | Model | Cost |
|---|---|---|
| Groq | llama-3.1-8b-instant | Free tier |
| OpenAI | gpt-3.5-turbo | Pay-as-you-go |
| Hugging Face | microsoft/DialoGPT-large | Free tier |
| Ollama | llama3.2:3b (or any local model) | Completely free |

### Tooling

- **ESLint** — linting for both frontend and backend
- **Prettier** — code formatting
- **Husky + lint-staged** — pre-commit hooks
- **Vitest** — unit and integration testing
- **concurrently** — run frontend and backend dev servers in parallel

---

## Project Structure

```
chill-sessions-bot/
├── src/                          # Frontend (React/TypeScript)
│   ├── components/
│   │   ├── ui/                   # shadcn/ui base components
│   │   ├── Chat.tsx              # Main chat interface
│   │   ├── ChatPreview.tsx       # Landing page chat preview
│   │   ├── CTA.tsx               # Call-to-action section
│   │   ├── Features.tsx          # Feature highlights section
│   │   ├── Hero.tsx              # Hero section with crisis info modal
│   │   └── LoginModal.tsx        # Optional name entry modal
│   ├── contexts/
│   │   └── UserContext.tsx       # User session state
│   ├── hooks/
│   │   ├── use-mobile.tsx        # Responsive breakpoint hook
│   │   └── use-toast.ts          # Toast notification hook
│   ├── pages/
│   │   ├── Index.tsx             # Landing + chat page
│   │   └── NotFound.tsx          # 404 page
│   ├── services/
│   │   └── api.ts                # Typed API client (fetch wrapper)
│   ├── lib/
│   │   └── utils.ts              # Utility functions (cn, etc.)
│   ├── index.css                 # Global styles and Tailwind directives
│   └── main.tsx                  # React entry point
│
├── backend/                      # Backend (Express/TypeScript)
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts            # Environment variable validation and config
│   │   ├── database/
│   │   │   └── init.ts           # SQLite init, schema, and query helpers
│   │   ├── lib/
│   │   │   └── logger.ts         # Pino logger setup
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts   # Centralized error handling
│   │   │   └── validation.ts     # Joi request validation middleware
│   │   ├── routes/
│   │   │   ├── chat.ts           # Chat session and message endpoints
│   │   │   └── health.ts         # Health check endpoints
│   │   ├── services/
│   │   │   ├── aiService.ts      # LLM provider abstraction + system prompt
│   │   │   └── webSearch.ts      # Research reference injection service
│   │   └── server.ts             # Express app setup and startup
│   ├── tests/                    # Backend test suite
│   ├── api/                      # Vercel serverless function entry
│   ├── vercel.json               # Vercel deployment config
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── vitest.config.ts
│   └── package.json
│
├── public/                       # Static assets
├── index.html                    # Vite HTML entry
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.js
├── vercel.json                   # Frontend Vercel config
├── railway.json                  # Railway deployment config
└── package.json                  # Root package with unified dev/build/test scripts
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 8
- An API key for at least one AI provider, **or** Ollama installed locally

### Installation

Clone the repository and install dependencies for both the frontend and backend:

```bash
git clone <your-repo-url>
cd chill-sessions-bot

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### Environment Variables

Copy the backend example environment file:

```bash
cp backend/env.example backend/.env
```

Then edit `backend/.env`:

```env
# Choose one: ollama | groq | openai | huggingface
AI_PROVIDER=groq

# Provider API keys (only the one you chose is required)
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_token_here

# Ollama (only required if AI_PROVIDER=ollama)
OLLAMA_URL=http://localhost:11434

# Server
PORT=3001
NODE_ENV=development

# CORS — must match your frontend URL exactly
FRONTEND_URL=http://localhost:8080

# Database path (relative to backend/)
DATABASE_PATH=./data/chill-sessions.db

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

For the frontend, create a `.env` at the project root:

```env
VITE_API_URL=http://localhost:3001/api
```

### Running Locally

Start both frontend and backend together from the project root:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 — backend (tsx watch mode)
npm run dev:backend

# Terminal 2 — frontend (Vite HMR)
npm run dev:frontend
```

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3001/api`

---

## AI Provider Options

### Groq (Recommended for free cloud inference)

Groq provides free-tier access to Llama 3.1 with fast inference.

1. Sign up at [console.groq.com](https://console.groq.com)
2. Generate a free API key
3. Set in `.env`:
   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=your_key_here
   ```

### Ollama (Recommended for fully local/private use)

Ollama runs models entirely on your machine — no API key, no data sent externally.

```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a lightweight model
ollama pull llama3.2:3b

# Start the Ollama server
ollama serve
```

Then set in `.env`:
```env
AI_PROVIDER=ollama
OLLAMA_URL=http://localhost:11434
```

### Hugging Face (Free tier)

1. Create an account at [huggingface.co](https://huggingface.co)
2. Generate a token at Settings > Access Tokens
3. Set in `.env`:
   ```env
   AI_PROVIDER=huggingface
   HUGGINGFACE_API_KEY=your_token_here
   ```

Model used: `microsoft/DialoGPT-large` (~1000 req/month on the free inference API)

### OpenAI

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
```

Model used: `gpt-3.5-turbo`. New accounts receive $5 in free credits.

---

## API Reference

All routes are prefixed with `/api`.

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server status, uptime, timestamp |
| `GET` | `/health/ai` | AI provider status and test response |

### Chat Sessions

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/chat/sessions` | Create a new session and receive the AI's initial greeting |
| `GET` | `/chat/sessions` | List recent sessions (paginated) |
| `GET` | `/chat/sessions/:sessionId` | Get session metadata |
| `GET` | `/chat/sessions/:sessionId/messages` | Get messages for a session (paginated) |
| `POST` | `/chat/sessions/:sessionId/messages` | Send a message and receive the AI's response |

**`POST /api/chat/sessions`**

Request:
```json
{ "userName": "Alex" }
```

Response `201`:
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "greeting": "Hey Alex. Just so you know, I'm an AI and not a clinician, so take my replies with a grain of salt. What's on your mind?",
  "message": "New chat session created successfully"
}
```

**`POST /api/chat/sessions/:sessionId/messages`**

Request:
```json
{
  "text": "I've been feeling really anxious about my exams.",
  "userName": "Alex"
}
```

Response `200`:
```json
{
  "userMessage": {
    "id": "abc123",
    "sessionId": "550e8400-...",
    "text": "I've been feeling really anxious about my exams.",
    "sender": "user",
    "timestamp": "2026-05-14T10:01:00.000Z"
  },
  "aiMessage": {
    "id": "def456",
    "sessionId": "550e8400-...",
    "text": "That sounds really stressful. What's making you most anxious about it, the material itself, or something else?",
    "sender": "ai",
    "timestamp": "2026-05-14T10:01:02.000Z"
  },
  "message": "Message sent and response generated successfully"
}
```

**Validation rules:**

| Field | Rule |
|---|---|
| `text` | Required, 1–2000 characters |
| `userName` | Optional, 1–100 characters |
| `sessionId` | Must be a valid UUID v4 |
| `page` | Integer, min 1, default 1 |
| `limit` | Integer, 1–100, default 20 |

---

## Frontend Architecture

### API Client (`src/services/api.ts`)

A typed `ApiService` class wraps all backend calls using the native `fetch` API. It reads `VITE_API_URL` from the environment at build time and handles JSON parsing, HTTP error extraction, and throws consistently typed errors.

### State Management

- **TanStack Query** manages server state (sessions, messages) with automatic caching and background refetching.
- **UserContext** (`src/contexts/UserContext.tsx`) holds the current user name in React context, accessible throughout the component tree.
- Local component state handles UI concerns (modal open/close, chat input value).

### Key Components

| Component | Description |
|---|---|
| `Hero.tsx` | Landing hero with tagline, CTA buttons, and "How It Works" dialog that explains the AI's limitations and surfaces the NIMHANS crisis contact |
| `Chat.tsx` | Full chat interface: message thread, input box, send handler, session lifecycle management |
| `ChatPreview.tsx` | Non-interactive demo conversation shown on the landing page |
| `Features.tsx` | Marketing section listing app features |
| `CTA.tsx` | Bottom call-to-action section |
| `LoginModal.tsx` | Optional name-entry modal triggered before starting a session |

### Routing

React Router v6 with two routes:

| Path | Component | Description |
|---|---|---|
| `/` | `Index.tsx` | Landing page with embedded chat |
| `*` | `NotFound.tsx` | 404 fallback |

---

## Backend Architecture

### Request Lifecycle

```
Incoming request
  -> Rate limiter        (100 req / 15 min per IP)
  -> Helmet              (security headers, strict CSP)
  -> CORS                (restricted to FRONTEND_URL)
  -> Compression         (gzip)
  -> Pino HTTP logger
  -> JSON body parser    (1 MB limit)
  -> Route handler
       -> Joi validation (body, query params, route params)
       -> Business logic
       -> SQLite query
       -> AIService.generateResponse()
            -> Load last 10 messages from DB for context
            -> Build system prompt
            -> Inject research context if relevant keywords detected
            -> Call active AI provider (Groq / OpenAI / HuggingFace / Ollama)
            -> Return trimmed response string
       -> Save AI message to DB
  -> JSON response
  -> Centralized error handler (on any throw)
```

### System Prompt Design

The AI is given a detailed system prompt on every request that enforces:

1. **Identity rules**: AI explicitly identifies as software with no credentials, no licensure, no clinical background. Must answer identity questions plainly and immediately.
2. **Safety behavior**: Crisis keyword detection, mandatory helpline surfacing (NIMHANS 080-46110007, iCall 9152987821), immediate escalation to professional care for anything beyond everyday struggles.
3. **Communication style**: Warm, direct, 2-4 sentence replies per message, no em-dashes, no unsolicited bullet lists, one focused question at a time.
4. **Therapeutic framing**: CBT/DBT/ACT/mindfulness described as "this approach suggests..." — never framed as personal clinical experience.
5. **Research context injection**: If the user's message contains therapeutic keywords (anxiety, depression, CBT, mindfulness, etc.), curated academic references are appended to the system prompt for the AI to draw from naturally.

### AI Provider Abstraction

All four providers implement a shared `AIProvider` interface:

```typescript
interface AIProvider {
  name: string;
  generateResponse(messages: Message[], systemPrompt: string): Promise<string>;
}
```

The active provider is selected at runtime via `config.AI_PROVIDER`. Adding a new provider requires implementing this interface and adding a case to the factory in `AIService.getProvider()`.

### Error Handling

- All route handlers pass errors via `next(createError(...))`.
- The centralized `errorHandler` middleware formats all errors into a consistent JSON shape.
- Provider-specific errors (rate limits, bad API keys) map to appropriate HTTP status codes (503 for unavailability).
- A generic user-facing fallback message is returned rather than leaking internal details.

---

## Database Schema

SQLite database at `backend/data/chill-sessions.db` (configurable via `DATABASE_PATH`).

### `sessions`

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (UUID) | Primary key |
| `created_at` | DATETIME | Auto set on insert |
| `updated_at` | DATETIME | Auto-updated by trigger on each new message |
| `message_count` | INTEGER | Auto-incremented by trigger |
| `metadata` | TEXT | JSON blob, reserved for future use |

### `messages`

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (UUID) | Primary key |
| `session_id` | TEXT | Foreign key to `sessions.id`, CASCADE DELETE |
| `text` | TEXT | Message content |
| `sender` | TEXT | `'user'` or `'ai'` (CHECK constraint enforced) |
| `timestamp` | DATETIME | Auto set on insert |
| `metadata` | TEXT | JSON blob, reserved for future use |

**Indexes:** `idx_messages_session_id`, `idx_messages_timestamp`

**Trigger:** `update_session_on_message` fires AFTER INSERT on `messages`, updating `sessions.updated_at` and incrementing `sessions.message_count`.

---

## Security

| Measure | Implementation |
|---|---|
| HTTP security headers | Helmet with strict CSP (`defaultSrc: 'self'`) |
| Rate limiting | 100 requests per 15 minutes per IP |
| CORS | Restricted to `FRONTEND_URL` env variable |
| Input validation | Joi schemas on all request bodies, query params, and route params |
| SQL injection prevention | Parameterised queries throughout |
| Request size limit | JSON body capped at 1 MB |
| Error leakage prevention | Internal error details never exposed to clients |
| Graceful shutdown | SIGTERM/SIGINT handlers for clean process exit |

---

## Testing

```bash
# Run all tests (frontend + backend)
npm run test:all

# Frontend tests only
npm test

# Backend tests only
npm run test:backend

# Watch mode (frontend)
npm run test:watch
```

Frontend tests use **Vitest** + **Testing Library** + **jsdom**.
Backend tests use **Vitest** + **Supertest** for HTTP integration testing.

Run the complete CI check locally (lint + typecheck + test + build):

```bash
npm run ci
```

---

## Deployment

### Vercel (Frontend + Backend Serverless)

Both the frontend and backend include `vercel.json` configurations.

**Deploy frontend:**
```bash
vercel --prod
```
Set `VITE_API_URL` to your backend deployment URL in Vercel's project environment settings.

**Deploy backend:**
```bash
cd backend && vercel --prod
```

The `backend/api/` directory contains the Vercel serverless function entry point. Note: SQLite requires a writable filesystem. For production use on serverless platforms, migrate to a serverless-compatible database such as Turso or Neon.

### Railway

A `railway.json` is included for Railway deployment with persistent disk, which works with SQLite:

```bash
railway up
```

### Docker

```bash
# Build the backend image
docker build -t chill-sessions-backend ./backend

# Run with environment variables
docker run -p 3001:3001 --env-file backend/.env chill-sessions-backend
```

### Self-hosted with PM2

```bash
# Build both
npm run build
npm run build:backend

# Serve frontend (static output)
npx serve dist -p 8080

# Run backend with PM2
cd backend && pm2 start dist/server.js --name chill-sessions-backend
```

---

## Available Scripts

From the project root:

| Script | Description |
|---|---|
| `npm run dev` | Start frontend and backend together |
| `npm run dev:frontend` | Start Vite dev server only |
| `npm run dev:backend` | Start backend with tsx watch only |
| `npm run build` | Build frontend for production |
| `npm run build:backend` | Compile backend TypeScript |
| `npm run lint` | Lint frontend |
| `npm run lint:all` | Lint frontend and backend |
| `npm run format` | Format all files with Prettier |
| `npm run typecheck` | Type-check frontend |
| `npm run typecheck:all` | Type-check frontend and backend |
| `npm test` | Run frontend tests |
| `npm run test:all` | Run all tests |
| `npm run ci` | Full CI pipeline: lint + typecheck + test + build |

---

## Important Disclaimer

Chill Sessions is a peer-support AI companion, not a licensed mental health service. It is not a substitute for professional therapy, psychiatry, or crisis intervention.

**If you are in crisis, please contact:**
- **NIMHANS (India):** 080-46110007
- **iCall:** 9152987821
- **Emergency services:** 112

The AI is programmed to proactively surface these resources whenever crisis-related language is detected.

---

## License

MIT License — free to use, modify, and distribute.
