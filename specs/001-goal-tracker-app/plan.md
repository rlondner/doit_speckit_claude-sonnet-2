# Implementation Plan: Do It - Goal Tracker App

**Branch**: `001-goal-tracker-app` | **Date**: 2026-05-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-goal-tracker-app/spec.md`

## Summary

Build the initial version of the **Do It** goal-tracking web app as a Next.js 16
(App Router) application. Users manage personal goals across two dashboard columns:
Active Goals (with urgency highlighting for ≤ 3 days remaining) and Recently
Completed. Goals can be added via modal, completed/restored via checkbox, edited,
and permanently deleted. Storage is switchable via `NEXT_PUBLIC_STORAGE_MODE`
between client-side localStorage (demo) and PostgreSQL via Next.js API routes
(production). The UI follows the Radiant Catalyst design system using Tailwind v4
`@theme`, shadcn/ui components, and the HTML reference files in `design/orange/`.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode), Node.js 20+
**Primary Dependencies**: Next.js 16 (App Router), React 19, Tailwind CSS v4,
  shadcn/ui (button, dialog, input, label, checkbox, badge), date-fns v4,
  swagger-ui-react v5, pg v8
**Storage**: localStorage (demo) / PostgreSQL via `pg` (production) — switched by
  `NEXT_PUBLIC_STORAGE_MODE` env var
**Testing**: None (prohibited by constitution)
**Target Platform**: Web browser (desktop + mobile responsive)
**Project Type**: Web application (single Next.js project — frontend + API routes)
**Performance Goals**: Dashboard loads in < 2 seconds; checkbox interaction < 1s
  perceived
**Constraints**: No auth; single-user; no test frameworks installed; no ORM
**Scale/Scope**: Single user, one table (`goals`), ~5 shadcn components, 5 API
  endpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Code | ✅ PASS | Storage abstraction via interface; thin route handlers; services in `lib/` |
| II. Simple UX | ✅ PASS | Two columns, two modals; no extraneous controls in primary viewport |
| III. Responsive Design | ✅ PASS | Tailwind responsive classes; mobile stacking; 44px touch targets on cards |
| IV. Minimal Dependencies | ✅ PASS | All deps pre-installed; 0 new packages added; each dep justified in research.md |
| V. Code Style | ✅ PASS | `"strict": true` in tsconfig; ESLint + Prettier; zero `any` usage planned |
| No Testing | ✅ PASS | No test files, no test framework dependencies |
| NestJS for APIs | ⚠️ DEVIATION (justified) | Using Next.js API routes instead — see Complexity Tracking |
| PostgreSQL via Next.js API routes | ✅ PASS | Matches constitution storage guidance exactly |
| shadcn preferred for UI | ✅ PASS | All standard primitives use shadcn components |

*Post-Phase 1 re-check*: All gates pass. Deviation justified below.

## Project Structure

### Documentation (this feature)

```text
specs/001-goal-tracker-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── openapi.yaml     # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── globals.css                    # Tailwind @theme color tokens + base styles
├── layout.tsx                     # Root layout (fonts: Plus Jakarta Sans + Inter)
├── page.tsx                       # Dashboard page (two-column layout)
├── api-docs/
│   └── page.tsx                   # Swagger UI page ('use client')
└── api/
    └── goals/
        ├── route.ts               # GET /api/goals, POST /api/goals
        └── [id]/
            └── route.ts           # GET, PATCH, DELETE /api/goals/:id

components/
├── dashboard/
│   ├── DashboardHeader.tsx        # Greeting + active goal count + Add button
│   ├── ActiveGoalsList.tsx        # Left column — renders GoalCard list
│   ├── CompletedGoalsList.tsx     # Right column — renders completed entries
│   └── GoalCard.tsx               # Single goal card (checkbox, title, days badge)
└── modals/
    ├── AddGoalModal.tsx           # Dialog for creating a new goal
    └── EditGoalModal.tsx          # Dialog for editing / deleting a goal

lib/
├── storage/
│   ├── types.ts                   # Goal interface + GoalStorage interface
│   ├── localStorageStorage.ts     # LocalStorageGoalStorage implementation
│   ├── postgresStorage.ts         # PostgresGoalStorage implementation
│   └── index.ts                   # Factory: reads NEXT_PUBLIC_STORAGE_MODE
├── db/
│   ├── schema.sql                 # PostgreSQL DDL (run once)
│   └── pool.ts                    # pg Pool singleton (production only)
└── utils/
    └── dates.ts                   # date-fns helpers (daysLeft, isOverdue, etc.)

public/
└── openapi.yaml                   # OpenAPI 3.0 spec (served statically for Swagger UI)
```

**Structure Decision**: Single Next.js project (web application). Frontend pages in
`app/`, shared logic in `lib/`, UI components in `components/`. No separate backend
service — Next.js API routes fulfill the RESTful JSON API requirement.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Next.js API routes instead of NestJS | This is a single-page web app with one table and five CRUD endpoints. A separate NestJS service adds a second deployment, second process, and CORS configuration for zero functional benefit at this scope. | NestJS would satisfy the constitution's "thin controller + service" pattern, but at the cost of significant infrastructure overhead. The constitution itself endorses Next.js API routes for PostgreSQL access. |
