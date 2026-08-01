# Manish Mishra — Luxury Portfolio CMS

A production-ready, full-stack portfolio CMS built with Next.js 15, Prisma, Neon PostgreSQL, and Cloudinary. Features a stunning public-facing portfolio and a fully-featured CMS admin panel.

## Features

- **Premium Design:** Glassmorphism, animated neural network background, micro-interactions, dark mode.
- **Dynamic Content:** Rotating hero titles, animated stats, expandable skill clusters, and project tilt cards.
- **Admin CMS:** Dedicated `/admin` portal secured by JWT and bcrypt to manage all content dynamically without code changes.
- **Storage:** Cloudinary integration for automatic image compression and optimized delivery.
- **Database:** Prisma ORM with PostgreSQL (Neon) for scalable data storage.
- **Pre-Seeded Profile:** Automatically pre-populated with your entire CV (experience, skills, stats, and major projects like MediReporter, BoardUniverse, DataForge).

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS 4, Shadcn UI
- **Animations:** Framer Motion, Canvas API
- **Database:** PostgreSQL (Neon), Prisma ORM
- **Auth:** JWT (httpOnly cookies), bcryptjs
- **Storage:** Cloudinary

## Quick Start

### 1. Set Up External Services
You will need free accounts on:
1. [Neon.tech](https://neon.tech) (PostgreSQL Database)
2. [Cloudinary](https://cloudinary.com) (Image Storage)

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill in the values in `.env` with your Neon connection strings and Cloudinary API keys. Generate a random `JWT_SECRET` (e.g. `openssl rand -base64 32`).

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Database & Seed Data
Push the Prisma schema to Neon and seed the database with your profile data:
```bash
npx prisma db push
npm run prisma:seed  # or npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Admin Access
- **URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Username:** `manish`
- **Password:** `admin123`
*(Make sure to change the password from the settings after logging in).*

## Deployment
Deploy easily to Vercel:
1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add all the Environment Variables from your `.env` file to the Vercel project settings.
4. Vercel will automatically build and deploy the Next.js app.
