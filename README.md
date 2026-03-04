# Business Agency Platform

A full-stack agency website and admin dashboard built with Next.js App Router, TypeScript, Prisma, PostgreSQL, Clerk, and Upstash Redis.

## Features

- Public marketing site with service and portfolio pages
- Role-aware authentication with Clerk
- Admin dashboard for managing services and portfolios
- Inquiry capture and inquiry status workflow
- Server actions + API routes with Prisma data access

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Prisma ORM + PostgreSQL
- Clerk authentication
- Tailwind CSS
- Upstash Redis

## Environment Variables

Create a `.env` file and set:

```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
