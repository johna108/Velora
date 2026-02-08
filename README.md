# Velora

A startup operations management platform built with Next.js 15 and Supabase.

## Getting Started

1. **Set up Supabase:**
   - Create a project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key from **Settings → API**

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

3. **Install dependencies and run:**
   ```bash
   npm install
   npm run dev
   ```

4. **Open** [http://localhost:9002](http://localhost:9002) in your browser.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Auth & Database:** Supabase
- **AI:** Google Genkit with Gemini 2.5 Flash
- **UI:** shadcn/ui + Tailwind CSS
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
