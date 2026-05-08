---
description: "Task list for Do It - Goal Tracker App"
---

# Tasks: Do It - Goal Tracker App

**Input**: Design documents from `/specs/001-goal-tracker-app/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/openapi.yaml ✅

**Tests**: None — zero-testing mandate per constitution. No test tasks included.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- All file paths are relative to the repository root

## Path Conventions

```
app/                     Next.js pages and API routes
components/dashboard/    Dashboard UI components
components/modals/       Modal dialog components
lib/storage/             Storage abstraction layer
lib/db/                  Database utilities
lib/utils/               Shared utility functions
public/                  Static assets (OpenAPI spec)
```

---

## Phase 1: Setup

**Purpose**: Project-level configuration before any feature code is written.

- [ ] T001 Configure Tailwind `@theme` color tokens in `app/globals.css` using all color values from `design/orange/do_it_dashboard/code.html` (primary: #ff7f70, surface: #f8fafc, on-surface: #1e293b, and the full Radiant Catalyst palette) plus `@font-face` imports for Plus Jakarta Sans and Inter
- [ ] T002 Update `app/layout.tsx` to apply Plus Jakarta Sans as the default headline font and Inter as the body font, set `<html lang="en">`, and wrap `{children}` with a `<body>` using `bg-background text-on-surface` Tailwind classes
- [ ] T003 [P] Initialize shadcn by running `npx shadcn@latest init` (select Default style, Neutral base color, CSS variables: Yes) then add required components: `npx shadcn@latest add button dialog input label checkbox badge` — this creates `components/ui/` with the 6 component files
- [ ] T004 [P] Copy the OpenAPI spec to the public folder: `cp specs/001-goal-tracker-app/contracts/openapi.yaml public/openapi.yaml` — this file is served statically for the Swagger UI page

**Checkpoint**: `npm run dev` starts without errors; Tailwind coral/orange colors are applied to the default page.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data types, storage abstraction, API routes, and utilities that ALL user stories depend on.

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete.

- [ ] T005 Define `Goal` interface and `GoalStorage` interface in `lib/storage/types.ts` — `Goal` has fields: `id: string`, `title: string`, `endDate: string` (YYYY-MM-DD), `status: 'active' | 'completed'`, `completedAt: string | null`, `createdAt: string`; `GoalStorage` has methods: `getAll(): Promise<Goal[]>`, `getById(id: string): Promise<Goal | null>`, `create(data: Pick<Goal, 'title' | 'endDate'>): Promise<Goal>`, `update(id: string, data: Partial<Pick<Goal, 'title' | 'endDate' | 'status' | 'completedAt'>>): Promise<Goal>`, `remove(id: string): Promise<void>`
- [ ] T006 [P] Implement date utility functions in `lib/utils/dates.ts` using date-fns v4: `getDaysLeft(endDate: string): number` (uses `differenceInCalendarDays`), `isUrgent(endDate: string): boolean` (daysLeft >= 0 && daysLeft <= 3), `isOverdue(endDate: string): boolean` (daysLeft < 0), `getRelativeCompletion(completedAt: string): string` (uses `formatDistanceToNow` with `{ addSuffix: true }`)
- [ ] T007 [P] Create PostgreSQL DDL in `lib/db/schema.sql`: `CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS goals (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title VARCHAR(100) NOT NULL, end_date DATE NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed')), completed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());`
- [ ] T008 [P] Create `pg` Pool singleton in `lib/db/pool.ts` that exports a single `Pool` instance constructed from `process.env.DATABASE_URL`; the file MUST guard against client-side import (throw if called outside Node.js)
- [ ] T009 [P] Implement `LocalStorageGoalStorage` in `lib/storage/localStorageStorage.ts` implementing `GoalStorage`: reads/writes `JSON.parse/stringify` under key `"doit:goals"`; `create` generates id via `crypto.randomUUID()` and sets `createdAt` to `new Date().toISOString()`; `update` merges partial fields; `remove` filters by id; all methods return `Promise.resolve(...)` wrappers; catches `QuotaExceededError` on write and throws a typed error with message `"Storage is full. Please delete some goals to continue."`
- [ ] T010 [P] Implement `ApiGoalStorage` in `lib/storage/apiStorage.ts` implementing `GoalStorage`: each method calls the corresponding `/api/goals` or `/api/goals/:id` endpoint via `fetch`; parses the `{ data }` envelope; throws on non-2xx responses with the error body's `message` field
- [ ] T011 Create storage factory in `lib/storage/index.ts`: export `function getStorage(): GoalStorage` that checks `process.env.NEXT_PUBLIC_STORAGE_MODE === 'production'` and returns `new ApiGoalStorage()`, otherwise returns `new LocalStorageGoalStorage()`; this function is called on the client side only
- [ ] T012 [P] Implement `PostgresGoalStorage` in `lib/storage/postgresStorage.ts` implementing `GoalStorage`: uses the `pool` from `lib/db/pool.ts`; maps snake_case DB columns to camelCase fields (`end_date` → `endDate`, `completed_at` → `completedAt`, `created_at` → `createdAt`); `create` uses parameterized INSERT returning all columns; `update` builds dynamic SET clause from provided fields (converting camelCase to snake_case); `remove` uses DELETE WHERE id = $1
- [ ] T013 [P] Implement `GET /api/goals` and `POST /api/goals` in `app/api/goals/route.ts`: GET returns `{ data: Goal[] }` filtered by optional `?status=` query param using `PostgresGoalStorage.getAll()`; POST validates `title` (required, max 100 chars) and `endDate` (required, valid date, today or later), returns 201 `{ data: Goal }` on success, 400 `{ code, message }` on validation failure, 500 on DB error
- [ ] T014 [P] Implement `GET /api/goals/[id]`, `PATCH /api/goals/[id]`, and `DELETE /api/goals/[id]` in `app/api/goals/[id]/route.ts`: GET returns 404 if not found; PATCH validates partial update fields, sets `completedAt = new Date().toISOString()` when `status` changes to `'completed'` and clears it when changed to `'active'`; DELETE returns 204 on success
- [ ] T015 [P] Create `app/api-docs/page.tsx` as a `'use client'` component that dynamically imports `swagger-ui-react` (to avoid SSR issues) and renders `<SwaggerUI url="/openapi.yaml" />`; import the swagger-ui-react CSS in this file

**Checkpoint**: All foundational files compile with `npx tsc --noEmit`. API routes respond correctly when tested via Swagger UI at `/api-docs` (in production mode) or in isolation via curl.

---

## Phase 3: User Story 1 - View Active and Completed Goals (Priority: P1) 🎯 MVP

**Goal**: Render the two-column dashboard showing all active goals (with urgency/overdue states) and completed goals, fully responsive.

**Independent Test**: Seed goals directly into localStorage (`doit:goals`) with varied states and end dates; open the app and verify all rendering rules (days-left count, urgent highlight, overdue label, completed relative timestamp, empty state).

- [ ] T016 [P] [US1] Create `components/dashboard/GoalCard.tsx`: renders a single active goal card using shadcn `Checkbox` (unchecked state) + goal `title` + shadcn `Badge` showing days-left or "Overdue"; card background is `bg-surface-container-lowest`; urgent styling (`isUrgent === true`): badge uses `bg-error-container text-on-error-container` and card has a left border using primary color; overdue styling (`isOverdue === true`): badge shows "Overdue" text with `bg-error-container`; standard styling: badge shows "X DAYS LEFT" with `bg-tertiary-container`; accepts props `goal: Goal`, `onToggleComplete: (id: string) => void`, `onClick: (goal: Goal) => void`; minimum card height ensures 44px touch target on mobile
- [ ] T017 [P] [US1] Create `components/dashboard/ActiveGoalsList.tsx`: accepts `goals: Goal[]` prop; sorts by `getDaysLeft(g.endDate)` ascending (overdue goals float to top with negative daysLeft); renders a list of `GoalCard` components; renders an empty state `<p>` with motivational text when `goals.length === 0`; passes `onToggleComplete` and `onClick` down to each card
- [ ] T018 [P] [US1] Create `components/dashboard/CompletedGoalsList.tsx`: accepts `goals: Goal[]` prop; sorts by `completedAt` descending (most recent first); each entry renders the goal title with strikethrough styling, a filled checkmark icon, and `getRelativeCompletion(g.completedAt!)` text; renders an empty state paragraph when empty; each entry includes an `onClick` handler for restoring the goal (invokes `onToggleComplete`)
- [ ] T019 [P] [US1] Create `components/dashboard/DashboardHeader.tsx`: displays greeting `"Good morning, Alex"` + subtitle `"You have {count} active goal{s} to focus on today."`; renders a shadcn `Button` labelled `"+ Add New Goal"` with `bg-primary text-on-primary rounded-full` styling; accepts props `activeCount: number` and `onAddClick: () => void`
- [ ] T020 [US1] Build Dashboard page in `app/page.tsx`: marks it `'use client'`; calls `getStorage().getAll()` in a `useEffect` on mount to load goals; splits goals into `active` (status==='active') and `completed` arrays; renders `DashboardHeader` + two-column layout using `flex flex-col md:flex-row gap-6` so columns stack vertically on mobile (Active on top) and sit side by side on desktop; passes all required handlers; wraps storage errors in a visible `<p className="text-error">` banner

**Checkpoint**: Dashboard renders correctly with seeded localStorage data. Active goals column shows urgency highlights. Mobile viewport (375px) shows single-column stacked layout. Empty state message appears when no active goals.

---

## Phase 4: User Story 2 - Add a New Goal (Priority: P2)

**Goal**: Users can open a modal, fill in title + end date, and create a goal that immediately appears in the Active Goals column.

**Independent Test**: Click "+ Add New Goal", fill both fields with valid values, submit — new goal card appears in Active Goals. Submit empty form — validation message shown inline. Submit past end date — validation message shown.

- [ ] T021 [US2] Create `components/modals/AddGoalModal.tsx`: uses shadcn `Dialog`, `DialogContent`, `DialogHeader` with orange gradient header matching `design/orange/add_new_goal_modal_orange/code.html`; contains shadcn `Input` for Goal Title (max 100 chars) and a date `Input` (type="date", min=today) for End Date; shows inline validation errors below each field; shadcn `Button` "Create Goal" (primary style) and "Cancel" (ghost style); on valid submit calls `onSubmit(title, endDate)` prop and resets form; accepts props `open: boolean`, `onOpenChange: (open: boolean) => void`, `onSubmit: (title: string, endDate: string) => Promise<void>`
- [ ] T022 [US2] Wire `AddGoalModal` into `app/page.tsx`: add `addModalOpen` state; pass `onAddClick={() => setAddModalOpen(true)}` to `DashboardHeader`; render `<AddGoalModal>` with `onSubmit` that calls `getStorage().create({title, endDate})` then reloads goals from storage and closes the modal; display any storage error as a visible banner

**Checkpoint**: Create 3 goals via the modal; all appear in Active Goals with correct days-left counts. Validate that submitting empty or past-date fields shows errors without creating a goal.

---

## Phase 5: User Story 3 - Complete or Restore a Goal (Priority: P3)

**Goal**: Clicking a checkbox on an active goal moves it to Recently Completed; clicking the checkmark on a completed goal restores it to Active Goals.

**Independent Test**: With pre-seeded goals, click checkbox → goal moves to right column. Click checkmark on completed entry → goal moves back to left column with original title and end date.

- [ ] T023 [US3] Add complete toggle handler in `app/page.tsx`: implement `handleToggleComplete(id: string)` that finds the goal by id; if `status === 'active'` calls `storage.update(id, { status: 'completed', completedAt: new Date().toISOString() })`; if `status === 'completed'` calls `storage.update(id, { status: 'active', completedAt: null })`; then reloads all goals from storage; pass this handler as `onToggleComplete` to both `ActiveGoalsList` and `CompletedGoalsList`
- [ ] T024 [US3] Verify `GoalCard` checkbox in `components/dashboard/GoalCard.tsx` correctly calls `onToggleComplete(goal.id)` on `onCheckedChange` and that `CompletedGoalsList` entries call the same handler on click — adjust component props/callbacks if needed so both completion and restore use the single `handleToggleComplete` handler from T023

**Checkpoint**: Checkbox toggles goal between columns with immediate UI update. Active goal count in header updates. Completed entry shows "Completed just now" relative timestamp.

---

## Phase 6: User Story 4 - Delete a Goal (Priority: P4)

**Goal**: Clicking a goal card opens an edit modal; clicking "Delete Goal" shows a confirmation dialog; confirming permanently removes the goal.

**Independent Test**: With a pre-seeded goal, click its card → edit modal opens pre-filled. Click "Delete Goal" → confirmation appears. Confirm → goal gone from both columns. Cancel → goal remains.

- [ ] T025 [US4] Create `components/modals/EditGoalModal.tsx` skeleton: uses shadcn `Dialog` with orange gradient header matching `design/orange/edit_existing_goal/code.html`; displays shadcn `Input` fields (editable) for Goal Title and End Date pre-populated from the `goal` prop; renders a "Delete Goal" link/button (destructive style, `text-error`); renders a shadcn `AlertDialog` triggered by Delete click — AlertDialog body warns "This will permanently delete your goal. This action cannot be undone."; accepts props `goal: Goal | null`, `open: boolean`, `onOpenChange: (open: boolean) => void`, `onDelete: (id: string) => Promise<void>`, `onSave: (id: string, title: string, endDate: string) => Promise<void>`
- [ ] T026 [US4] Wire `onDelete` handler in `app/page.tsx`: implement `handleDeleteGoal(id: string)` that calls `getStorage().remove(id)` then reloads goals and closes modal; pass to `EditGoalModal` as `onDelete`
- [ ] T027 [US4] Wire `EditGoalModal` to goal card click in `app/page.tsx`: add `editModalGoal: Goal | null` state; pass `onClick={(goal) => setEditModalGoal(goal)}` to `ActiveGoalsList` (which passes to `GoalCard`); render `<EditGoalModal goal={editModalGoal} open={editModalGoal !== null} onOpenChange={(open) => { if (!open) setEditModalGoal(null); }} ...>`; also pass `onClick` to `CompletedGoalsList` so completed goals can also be edited/deleted

**Checkpoint**: Click any goal card → edit modal opens with correct pre-filled values. Delete + confirm → goal removed. Delete + cancel → goal remains.

---

## Phase 7: User Story 5 - Edit an Existing Goal (Priority: P5)

**Goal**: Users can modify a goal's title and/or end date via the edit modal and save the changes.

**Independent Test**: Click an active goal → modal shows current values. Change both fields → click Save Changes → modal closes → dashboard shows updated title and new days-left count.

- [ ] T028 [US5] Ensure `EditGoalModal` form fields in `components/modals/EditGoalModal.tsx` are fully editable with validation: `title` input required, max 100 chars, shows inline error; `endDate` input type="date" (no minimum restriction on edit — goal may already be overdue); a "Save Changes" `Button` (primary style) is rendered alongside "Cancel" and "Delete Goal"
- [ ] T029 [US5] Implement Save Changes handler in `app/page.tsx`: `handleSaveGoal(id: string, title: string, endDate: string)` calls `getStorage().update(id, { title, endDate })` then reloads goals and sets `editModalGoal` to null; pass as `onSave` prop to `EditGoalModal`

**Checkpoint**: All user stories now fully functional and independently testable.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, storage edge cases, and final validation.

- [ ] T030 [P] Add user-visible storage error handling: in `app/page.tsx`, catch any error thrown by storage calls (create/update/remove) and display it in a dismissible `<div className="bg-error-container text-on-error-container ...">` banner at the top of the dashboard; specifically handle the "Storage is full" message from `LocalStorageGoalStorage` (T009)
- [ ] T031 Run through the full manual validation checklist in `specs/001-goal-tracker-app/quickstart.md` and fix any rendering, layout, or interaction issues found

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately; T003 and T004 can run in parallel
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
  - T006, T007, T008 run in parallel with T005
  - T009, T010, T012 run in parallel (all need T005; T012 also needs T008)
  - T011 runs after T009 and T010
  - T013, T014 run in parallel after T012
  - T015 runs anytime after Phase 1
- **User Stories (Phase 3–7)**: All depend on Phase 2 completion; each phase in priority order
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2 — foundational only; no story dependency
- **US2 (P2)**: Starts after Phase 2 — may be implemented in parallel with US1 if T011 is done
- **US3 (P3)**: Depends on US1 (needs GoalCard + list components from T016–T018)
- **US4 (P4)**: Depends on US1 (needs card click wiring from T020) and US2 (goals need to exist)
- **US5 (P5)**: Depends on US4 (shares EditGoalModal from T025–T027)

### Within Each User Story

- Models/types before services (T005 before T009/T010/T012)
- Services before components (T011 before T016)
- Components before page assembly (T016–T019 before T020)
- Commit after each task or logical group

### Parallel Opportunities

```bash
# Phase 1
Task: T001 — Configure @theme in app/globals.css
Task: T002 — Configure app/layout.tsx
Task: T003 — shadcn init + add 6 components      [parallel with T001, T002]
Task: T004 — Copy openapi.yaml to public/         [parallel with T001, T002]

# Phase 2
Task: T005 — Define types in lib/storage/types.ts
Task: T006 — Date utils in lib/utils/dates.ts     [parallel with T005]
Task: T007 — DB schema in lib/db/schema.sql       [parallel with T005]
Task: T008 — pg Pool in lib/db/pool.ts            [parallel with T005]
# after T005:
Task: T009 — LocalStorageGoalStorage              [parallel with T010, T012]
Task: T010 — ApiGoalStorage                       [parallel with T009, T012]
Task: T012 — PostgresGoalStorage                  [parallel with T009, T010]
Task: T015 — Swagger UI page                      [parallel with above]
# after T009, T010:
Task: T011 — Storage factory
# after T012:
Task: T013 — GET+POST /api/goals route            [parallel with T014]
Task: T014 — GET+PATCH+DELETE /api/goals/[id]     [parallel with T013]

# Phase 3 (US1)
Task: T016 — GoalCard                             [parallel with T017, T018, T019]
Task: T017 — ActiveGoalsList                      [parallel with T016, T018, T019]
Task: T018 — CompletedGoalsList                   [parallel with T016, T017, T019]
Task: T019 — DashboardHeader                      [parallel with T016, T017, T018]
# after T016–T019:
Task: T020 — Dashboard page (app/page.tsx)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Seed localStorage, verify dashboard renders correctly with all states
5. Demo-ready: A read-only dashboard with seeded data

### Incremental Delivery

1. Setup + Foundational → Infrastructure ready
2. US1 → Dashboard renders (MVP — read-only with seeded data)
3. US2 → Can create goals via modal (fully self-contained app)
4. US3 → Can complete and restore goals (core loop complete)
5. US4 → Can delete goals (full lifecycle)
6. US5 → Can edit goals (full CRUD)
7. Polish → Production-quality error handling

---

## Notes

- `[P]` = different files, no blocking dependency — safe to parallelize
- `[Story]` label maps task to its user story for traceability
- No test tasks — zero-testing mandate per constitution (V. Code Style / Testing Policy)
- Verify each user story works independently before moving to the next
- Commit after each phase checkpoint
- `NEXT_PUBLIC_STORAGE_MODE=demo` in `.env.local` for all local development
