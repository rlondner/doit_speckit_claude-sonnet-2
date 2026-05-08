# Research: Do It - Goal Tracker App

## Decision Log

### D-001: Storage Abstraction Pattern

**Decision**: Define a `GoalStorage` TypeScript interface and provide two concrete
implementations — `LocalStorageGoalStorage` (client-side demo) and
`PostgresGoalStorage` (server-side production). A factory in `lib/storage/index.ts`
reads `NEXT_PUBLIC_STORAGE_MODE` at runtime and returns the correct implementation.

**Rationale**: A single interface means all dashboard components call the same
methods regardless of mode. Switching storage requires only changing the env var.
No code changes needed (satisfying SC-006).

**Alternatives considered**:
- Conditional imports per component — rejected: scatters storage logic, hard to
  maintain.
- Next.js middleware to proxy to different backends — rejected: unnecessary
  complexity for a single-user app.

---

### D-002: API Route Design (Next.js App Router)

**Decision**: Use Next.js App Router Route Handlers (`route.ts`) for all server-side
API endpoints. No separate NestJS backend is warranted for this single-page app.
The constitution's Next.js API route guidance for production PostgreSQL access is
the operative rule here.

**Rationale**: Next.js route handlers provide RESTful JSON APIs co-located with the
frontend with zero additional deployment infrastructure. Constitution Principle IV
(Minimal Dependencies) favors this approach over a separate NestJS server.

**Alternatives considered**:
- Separate NestJS service — rejected: over-engineered for a single-user goal tracker;
  adds deployment complexity without benefit at this scale.
- tRPC — rejected: non-RESTful, incompatible with the OpenAPI requirement.

**Justification logged in Complexity Tracking** in plan.md.

---

### D-003: Database Client

**Decision**: Use the `pg` package (already installed) with parameterized queries.
No ORM or query builder.

**Rationale**: The schema has one table (`goals`) with simple CRUD. An ORM adds
build-time complexity and type-generation steps that are not justified for this scope.
`pg` is already a dependency (Minimal Dependencies principle satisfied).

**Alternatives considered**:
- Prisma — rejected: requires schema generation, CLI steps, and a generated client;
  overkill for one table.
- Drizzle ORM — rejected: adds a dependency not yet in the project.

---

### D-004: Tailwind v4 Theme Colors

**Decision**: Declare all design-system color tokens under the `@theme` directive in
`app/globals.css`. Token names match the Radiant Catalyst palette from
`design/orange/do_it_dashboard/code.html` (e.g., `--color-primary: #ff7f70`).

**Rationale**: Tailwind v4 replaced `tailwind.config.js` theme extension with the
`@theme` CSS directive. All color tokens become CSS custom properties usable via
`bg-primary`, `text-primary`, etc. in Tailwind utilities.

**Alternatives considered**:
- Keep the old `tailwind.config.ts` approach — rejected: project uses Tailwind v4
  which does not use `tailwind.config.js` for theme in the same way; `@theme` is
  the v4 canonical approach.

---

### D-005: OpenAPI Spec + Swagger UI

**Decision**: Maintain a static OpenAPI 3.0 spec at `public/openapi.json`. Expose
Swagger UI at `/api-docs` using `swagger-ui-react` (already installed). The
`/api-docs` page fetches `public/openapi.json` from the same origin.

**Rationale**: Static JSON file is simple, version-controllable, and requires no
runtime generation. `swagger-ui-react` is already installed. The `/api-docs` route
is a Next.js page with `'use client'` since `swagger-ui-react` is a browser library.

**Alternatives considered**:
- `next-swagger-doc` to generate from JSDoc — rejected: adds a dependency; manual
  spec is cleaner for this small API.
- Scalar API reference — rejected: not installed; `swagger-ui-react` already present.

---

### D-006: shadcn Component Initialization

**Decision**: Initialize shadcn with `npx shadcn@latest init` targeting the existing
Next.js project (App Router, TypeScript, Tailwind). Add only the components needed:
`button`, `dialog`, `input`, `label`, `checkbox`, `badge`.

**Rationale**: Only 6 shadcn components required. Installing all shadcn components
would violate Minimal Dependencies. Each component is directly mapped to a UI need.

**Component justification**:
- `button` → "+ Add New Goal" CTA, modal action buttons
- `dialog` → Add Goal modal, Edit Goal modal
- `input` → Goal title text field
- `label` → Form field labels
- `checkbox` → Goal completion toggle on each card
- `badge` → "X DAYS LEFT" urgency indicator

---

### D-007: Date Utilities

**Decision**: Use `date-fns` (already installed) for all date calculations and
formatting.

**Rationale**: Already a project dependency. Provides `differenceInCalendarDays`,
`formatDistanceToNow`, `isPast`, `isToday` — all needed for days-left calculation,
overdue detection, and relative completion timestamps.

**Functions mapped to requirements**:
- Days remaining: `differenceInCalendarDays(endDate, new Date())`
- Overdue detection: `isPast(endDate) && !isToday(endDate)`
- Completion timestamp: `formatDistanceToNow(completedAt, { addSuffix: true })`

---

### D-008: PostgreSQL Schema

**Decision**: Single `goals` table with UUID primary key. Status stored as VARCHAR
with CHECK constraint. No migrations framework — ship a single `schema.sql` file.

**Rationale**: One table, simple CRUD. A migrations framework (Flyway, Drizzle
migrate) is not justified at this scope.

**Schema**:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS goals (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(100) NOT NULL,
  end_date    DATE         NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'active'
                           CHECK (status IN ('active', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

---

### D-009: Environment Variable Name

**Decision**: Use `NEXT_PUBLIC_STORAGE_MODE` (values: `demo` | `production`).
Default when absent: `demo`.

**Rationale**: `NEXT_PUBLIC_` prefix makes the value accessible in both server
and client components. This allows the storage factory to work identically in
both contexts.
