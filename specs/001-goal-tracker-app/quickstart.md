# Quickstart: Do It - Goal Tracker App

## Prerequisites

- Node.js 20+
- npm / pnpm
- (Production only) PostgreSQL 15+ instance accessible via connection string

## 1. Install Dependencies

```bash
npm install
```

All required packages are already declared in `package.json`.

## 2. Initialize shadcn Components

Run the shadcn init command and add the required components:

```bash
npx shadcn@latest init
npx shadcn@latest add button dialog input label checkbox badge
```

When prompted by `init`, select:
- Style: Default
- Base color: Neutral (theme colors come from `@theme` in `globals.css`)
- CSS variables: Yes

## 3. Configure Storage Mode

Create a `.env.local` file at the project root:

### Demo mode (localStorage — no database needed)

```env
NEXT_PUBLIC_STORAGE_MODE=demo
```

### Production mode (PostgreSQL)

```env
NEXT_PUBLIC_STORAGE_MODE=production
DATABASE_URL=postgresql://user:password@localhost:5432/doit
```

## 4. Set Up the Database (Production Only)

Create the database and run the schema:

```bash
psql $DATABASE_URL -f lib/db/schema.sql
```

## 5. Copy the OpenAPI Spec

The OpenAPI spec served by Swagger UI lives in `public/`:

```bash
cp specs/001-goal-tracker-app/contracts/openapi.yaml public/openapi.yaml
```

(Or maintain `public/openapi.yaml` as the canonical file during development.)

## 6. Run the Development Server

```bash
npm run dev
```

- Dashboard: http://localhost:3000
- API Docs (Swagger UI): http://localhost:3000/api-docs
- API endpoints: http://localhost:3000/api/goals

## 7. Manual Validation Checklist

Work through these acceptance scenarios after each implementation phase:

### Dashboard (US1)
- [ ] Open the app — two columns visible on desktop (Active left, Completed right)
- [ ] Resize to 375px — columns stack vertically (Active on top)
- [ ] Goal with 2 days left shows urgent highlight
- [ ] Goal with 10 days left shows standard styling
- [ ] Goal with past end date shows "Overdue" label
- [ ] Empty state message appears when no active goals

### Add Goal (US2)
- [ ] Click "+ Add New Goal" — modal opens
- [ ] Submit empty form — validation message shown
- [ ] Submit with past end date — validation message shown
- [ ] Submit valid goal — modal closes, goal appears in Active column

### Complete / Restore Goal (US3)
- [ ] Click checkbox on active goal — goal moves to Recently Completed
- [ ] Click checkmark on completed goal — goal moves back to Active Goals

### Delete Goal (US4)
- [ ] Click goal card — edit modal opens with current values pre-filled
- [ ] Click "Delete Goal" — confirmation prompt appears
- [ ] Confirm deletion — goal removed from dashboard
- [ ] Cancel deletion — goal remains

### Edit Goal (US5)
- [ ] Click goal card — edit modal opens
- [ ] Change title + end date, click Save — dashboard reflects new values

### Storage Switching (SC-006)
- [ ] Change `NEXT_PUBLIC_STORAGE_MODE` from `demo` to `production` — app uses
      PostgreSQL with no code changes
- [ ] Change back to `demo` — app uses localStorage

### API Docs
- [ ] Visit `/api-docs` — Swagger UI loads showing all 5 endpoints
- [ ] Execute `GET /api/goals` via Swagger UI — returns current goals as JSON
