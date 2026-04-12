# NATA-REVA — Architecture Entrance Prep Platform

A premium NATA preparation platform with AI-powered tutoring, practice tests, and analytics.

---

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — custom design system
- **Supabase** — Auth + Database
- **Chart.js** — Score trend charts
- **Google Gemini / Groq** — AI analysis

---

## Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo>
cd nata-reva
npm install
```

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Authentication → Settings** and enable Email/Password sign-in
4. Copy your **Project URL** and **anon/public key** from Settings → API

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Add at least one for real AI analysis
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
```

**Getting AI keys:**
- Gemini: [aistudio.google.com](https://aistudio.google.com) → Get API Key (free tier available)
- Groq: [console.groq.com](https://console.groq.com) → API Keys (free tier available)

> Without any API key, the app uses intelligent mock analysis — still functional for demo.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
nata-reva/
├── app/
│   ├── globals.css          # Design system, fonts, animations
│   ├── layout.tsx
│   ├── page.tsx             # Redirects to /login
│   ├── login/
│   │   └── page.tsx         # Auth page (login + signup)
│   ├── dashboard/
│   │   └── page.tsx         # Main dashboard
│   ├── test/
│   │   └── page.tsx         # 15-question MCQ test
│   ├── ai-tutor/
│   │   └── page.tsx         # AI analysis + score chart
│   └── api/
│       └── analyze/
│           └── route.ts     # AI API route (Gemini → Groq → Mock)
├── components/
│   └── Sidebar.tsx          # Navigation sidebar
├── lib/
│   ├── supabase.ts          # Supabase browser client
│   └── questions.ts         # 15 static NATA questions
├── supabase-schema.sql      # DB schema — run in Supabase SQL editor
├── .env.example
└── README.md
```

---

## Features

| Feature | Description |
|---|---|
| 🔐 Auth | Email/password login & signup via Supabase |
| 🏠 Dashboard | Welcome, stats, quick-access cards |
| 📝 Practice Test | 15 MCQ questions, 20-min timer, instant results |
| 🤖 AI Tutor | Gemini/Groq-powered analysis with strengths, weaknesses, tips |
| 📊 Analytics | Score trend chart, weak topic tracking |
| 🔗 KEA Link | Direct link to kea.kar.nic.in |

---

## AI Fallback Logic

```
if GEMINI_API_KEY exists → use Gemini Pro
else if GROQ_API_KEY exists → use Groq (Llama 3)
else → use smart mock analysis
```

---

## Supabase Schema

```sql
results (
  id          uuid PRIMARY KEY
  user_id     uuid → auth.users
  score       integer
  total       integer
  answers     jsonb
  weak_topics text[]
  created_at  timestamptz
)
```

RLS enabled — users can only read/write their own data.

---

## Build for Production

```bash
npm run build
npm start
```
