# Data Model: Do It - Goal Tracker App

## Entities

### Goal

Represents a single user objective with a deadline.

| Field        | Type                       | Constraints                          | Notes                                    |
|--------------|----------------------------|--------------------------------------|------------------------------------------|
| `id`         | `string` (UUID)            | Required, unique, auto-generated     | `gen_random_uuid()` in PostgreSQL; `crypto.randomUUID()` in localStorage |
| `title`      | `string`                   | Required, max 100 characters         | Goal display name                        |
| `endDate`    | `string` (ISO date, YYYY-MM-DD) | Required, today or later at creation | Date-only (no time component)           |
| `status`     | `'active' \| 'completed'`  | Required, default `'active'`         | Controls which column the goal appears in |
| `completedAt`| `string` (ISO datetime) \| `null` | Null when status is `'active'`  | Set on completion; cleared on restore    |
| `createdAt`  | `string` (ISO datetime)    | Required, auto-generated             | Used for tie-breaking sort               |

## TypeScript Interface

```typescript
export interface Goal {
  id: string;
  title: string;
  endDate: string;         // 'YYYY-MM-DD'
  status: 'active' | 'completed';
  completedAt: string | null; // ISO datetime string or null
  createdAt: string;       // ISO datetime string
}
```

## Storage Interface

```typescript
export interface GoalStorage {
  getAll(): Promise<Goal[]>;
  getById(id: string): Promise<Goal | null>;
  create(data: Pick<Goal, 'title' | 'endDate'>): Promise<Goal>;
  update(id: string, data: Partial<Pick<Goal, 'title' | 'endDate' | 'status' | 'completedAt'>>): Promise<Goal>;
  remove(id: string): Promise<void>;
}
```

## Lifecycle / State Transitions

```
         [create]              [checkbox click]
           ──►  active  ──────────────────────► completed
                  ▲                                  │
                  └──────────────────────────────────┘
                           [checkmark click / restore]
```

Deletion is available from either state (via edit modal) and is permanent.

## Computed / Derived Values

These are computed at render time from the stored `Goal` data — not persisted.

| Derived Value    | Source Fields         | Logic                                                |
|------------------|-----------------------|------------------------------------------------------|
| `daysLeft`       | `endDate`             | `differenceInCalendarDays(parseISO(endDate), new Date())` |
| `isUrgent`       | `endDate`, `status`   | `status === 'active' && daysLeft <= 3 && daysLeft >= 0` |
| `isOverdue`      | `endDate`, `status`   | `status === 'active' && daysLeft < 0`                |
| `relativeCompletion` | `completedAt`     | `formatDistanceToNow(parseISO(completedAt!), { addSuffix: true })` |

## PostgreSQL Schema

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

Column name mapping (snake_case DB → camelCase TypeScript):

| DB Column     | TypeScript Field |
|---------------|-----------------|
| `id`          | `id`            |
| `title`       | `title`         |
| `end_date`    | `endDate`       |
| `status`      | `status`        |
| `completed_at`| `completedAt`   |
| `created_at`  | `createdAt`     |

## localStorage Schema (Demo Mode)

Goals stored under a single namespaced key:

```
Key:   "doit:goals"
Value: JSON.stringify(Goal[])
```

All Goal fields are stored as-is (already JSON-serializable strings).

## Validation Rules

| Field    | Rule                                         | Error Message                          |
|----------|----------------------------------------------|----------------------------------------|
| `title`  | Non-empty string, max 100 characters         | "Title is required (max 100 characters)" |
| `endDate`| Valid date, must be today or later (on creation) | "End date must be today or in the future" |
| `endDate`| Valid ISO date format `YYYY-MM-DD`           | "Invalid date format"                  |

Note: End date validation on **edit** does NOT re-enforce the "today or later" rule
(a goal may already be overdue; the user should be allowed to correct the title only).

## Sort Order

| Column             | Sort                                      |
|--------------------|-------------------------------------------|
| Active Goals       | Ascending `daysLeft` (most urgent first); overdue goals float to top |
| Recently Completed | Descending `completedAt` (most recent first) |
