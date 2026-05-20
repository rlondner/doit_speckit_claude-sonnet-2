# DoIt — Goal Tracker App (Spec Kit-built)

This repository is the output of the **Spec Kit** tutorial:

> [Spec Kit vs OpenSpec: I Built the Same App Twice to Find Out](https://medium.com/@raphaellondner/spec-kit-vs-openspec-i-built-the-same-app-twice-to-find-out-0fcdcfa08b46)

Built with Next.js 16 (App Router), React 19, TypeScript 5, and Tailwind CSS v4.

---

## Installation

```bash
npm install
```

---

## Configuration

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

The app supports two storage modes controlled by `NEXT_PUBLIC_STORAGE_MODE` in `.env.local`.

### Demo mode (localStorage) — default

No database required. Data is stored in the browser's localStorage.

```env
NEXT_PUBLIC_STORAGE_MODE=demo
```

### Production mode (PostgreSQL)

Requires a running PostgreSQL instance (version 13+ recommended for `gen_random_uuid()` support).

```env
NEXT_PUBLIC_STORAGE_MODE=production
DATABASE_URL=postgresql://user:password@localhost:5432/doit
```

Replace `user`, `password`, `localhost`, `5432`, and `doit` with your actual database credentials.

#### Database provisioning

1. **Create the database and user:**

```sql
CREATE USER doit_user WITH PASSWORD 'your_password';
CREATE DATABASE doit OWNER doit_user;
```

2. **Connect to the database and apply the schema:**

```bash
psql -U doit_user -d doit -f lib/db/schema.sql
```

Or run the SQL manually after connecting:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS goals (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(100) NOT NULL,
  end_date     DATE         NOT NULL,
  status       VARCHAR(20)  NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

> The `pgcrypto` extension is required for `gen_random_uuid()`. It ships with standard PostgreSQL distributions and just needs to be enabled per database.

3. **Update `.env.local`** with your actual credentials:

```env
NEXT_PUBLIC_STORAGE_MODE=production
DATABASE_URL=postgresql://doit_user:your_password@localhost:5432/doit
```

---

## Running the app

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

The dev server runs on [http://localhost:3000](http://localhost:3000). The production server runs on port 3002.

---

## Other commands

```bash
npm test       # Run tests
npm run lint   # Lint the codebase
```
