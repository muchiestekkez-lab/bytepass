# BytePass ✈️

> **Stamp Your Internet.**

A playful web app where you create an Internet Passport and log "flights" between social platforms. Collect stamps. Share boarding passes. Go viral.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** TailwindCSS
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT via `jose` + bcrypt password hashing
- **Deploy:** Vercel (frontend) + any PostgreSQL provider

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo>
cd bytepass
npm install
```

### 2. Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random secret key (32+ chars) |
| `NEXT_PUBLIC_APP_URL` | Your deployed URL (e.g. `https://bytepass.app`) |

### 3. Database Setup

```bash
# Run Prisma migrations
npm run db:migrate

# Seed platform data (Instagram, TikTok, YouTube, etc.)
npm run db:seed
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

1. Push your code to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Set environment variables in the Vercel dashboard
4. Deploy!

> **Note:** Make sure to run `npm run db:migrate` and `npm run db:seed` after connecting your production database. You can do this from your local machine pointing at the production `DATABASE_URL`.

---

## Connecting PostgreSQL

Any PostgreSQL provider works. Recommended options:

| Provider | Notes |
|---|---|
| [Supabase](https://supabase.com) | Free tier, easy setup |
| [Neon](https://neon.tech) | Serverless PostgreSQL, Vercel-friendly |
| [Railway](https://railway.app) | Simple, generous free tier |

Use the connection string format:
```
postgresql://user:password@host:5432/dbname
```

For Neon/Supabase, use the **pooled connection** string in production.

---

## Project Structure

```
bytepass/
├── app/
│   ├── (auth)/               # Login & Register pages
│   ├── (dashboard)/          # Protected: Dashboard, Passport, Flights
│   ├── boarding/[id]/        # Public boarding pass page
│   ├── u/[username]/         # Public user profile page
│   ├── api/                  # API routes
│   └── page.tsx              # Landing page
├── components/
│   ├── auth/                 # Login & Register forms
│   ├── analytics/            # CitizenBadge, StatsRow
│   ├── flights/              # FlightCard, FlightForm, BoardingPass
│   ├── layout/               # Navbar, Sidebar
│   ├── passport/             # PassportCover, StampGrid, PassportStamp
│   └── ui/                   # Button, Card
├── lib/
│   ├── auth.ts               # JWT sign/verify, cookie helpers
│   ├── platforms.ts          # Static platform data
│   ├── prisma.ts             # Prisma client singleton
│   └── utils.ts              # cn(), getCitizenLevel(), formatDate(), etc.
├── prisma/
│   ├── schema.prisma         # Database models
│   └── seed.ts               # Seed 9 platforms
├── types/
│   └── index.ts              # Shared TypeScript types
└── middleware.ts             # Route protection
```

---

## Citizen Levels

| Level | Flights Needed |
|---|---|
| 🔭 Explorer | 0 |
| 📜 Scroll Rookie | 1+ |
| 🌍 Digital Nomad | 5+ |
| ✈️ Meme Pilot | 15+ |
| 🚀 Byte Captain | 30+ |
| 🌌 Internet Legend | 50+ |

---

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed platform data
npm run db:studio    # Open Prisma Studio
npm run db:push      # Push schema without migrations (prototyping)
```

---

Made with ✈️ by BytePass
