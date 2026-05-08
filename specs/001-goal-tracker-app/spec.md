# Feature Specification: Do It - Goal Tracker App

**Feature Branch**: `001-goal-tracker-app`
**Created**: 2026-05-08
**Status**: Draft
**Input**: User description: "initial app setup - goal tracking web app with two-column layout, goal CRUD, completion workflow, deadline highlighting, and environment-switchable storage"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Active and Completed Goals (Priority: P1)

A user opens the Do It app and sees a two-column dashboard. The left column
displays all active (incomplete) goals, each showing its title and the number
of days remaining until the end date. Goals approaching their deadline (3 days
or fewer remaining) are visually highlighted to signal urgency. The right
column displays completed goals with a completion timestamp. The user can
quickly scan both columns to understand their current progress and recent
accomplishments.

**Why this priority**: The dashboard is the foundational screen. Without it,
no other feature (adding, completing, or deleting goals) has a surface to
operate on. This is the minimum viable product.

**Independent Test**: Open the app with pre-seeded goal data. Verify that
active goals appear in the left column with correct days-left counts, urgent
goals are highlighted, and completed goals appear in the right column.

**Acceptance Scenarios**:

1. **Given** the user has 3 active goals and 2 completed goals, **When** the
   user opens the dashboard, **Then** 3 goal cards appear in the Active Goals
   column and 2 entries appear in the Recently Completed column.
2. **Given** an active goal has an end date 2 days from today, **When** the
   dashboard loads, **Then** that goal card is visually highlighted (urgent
   styling per the orange design system).
3. **Given** an active goal has an end date 10 days from today, **When** the
   dashboard loads, **Then** that goal card is displayed with standard (non-urgent)
   styling.
4. **Given** there are no active goals, **When** the user opens the dashboard,
   **Then** the Active Goals column displays an empty state message encouraging
   the user to add a goal.

---

### User Story 2 - Add a New Goal (Priority: P2)

A user wants to set a new goal. They click the "+ Add New Goal" button on the
dashboard, which opens a modal dialog. The modal contains fields for the goal
title and end date, along with Cancel and Create Goal buttons. After filling in
both fields and clicking Create Goal, the modal closes and the new goal appears
immediately in the Active Goals column.

**Why this priority**: Creating goals is the primary write operation. Without
it the app is read-only. This depends on US1 (the dashboard) to display results.

**Independent Test**: Click "+ Add New Goal," fill in a title and end date,
submit. Verify the modal closes and the new goal appears in the Active Goals
column with the correct days-left calculation.

**Acceptance Scenarios**:

1. **Given** the user is on the dashboard, **When** they click "+ Add New Goal,"
   **Then** a modal opens with Goal Title and End Date fields, plus Cancel and
   Create Goal buttons.
2. **Given** the modal is open with a valid title and a future end date entered,
   **When** the user clicks "Create Goal," **Then** the modal closes and the new
   goal appears in the Active Goals column.
3. **Given** the modal is open, **When** the user clicks Cancel or the X button,
   **Then** the modal closes without creating a goal.
4. **Given** the modal is open, **When** the user submits with an empty title,
   **Then** a validation message appears and the goal is not created.
5. **Given** the modal is open, **When** the user submits with an end date in
   the past, **Then** a validation message appears and the goal is not created.

---

### User Story 3 - Complete a Goal (Priority: P3)

A user has achieved one of their goals. They click the checkbox on the goal
card in the Active Goals column. The goal moves from the Active Goals column
to the Recently Completed column, reflecting the accomplishment immediately.

**Why this priority**: Completing goals is the core loop of the app. It depends
on US1 (dashboard display) and benefits from US2 (goal creation) but can be
verified independently with pre-seeded data.

**Independent Test**: With pre-seeded active goals, click the checkbox on one.
Verify it disappears from Active Goals and appears in Recently Completed.

**Acceptance Scenarios**:

1. **Given** an active goal exists, **When** the user clicks the checkbox on
   that goal card, **Then** the goal moves to the Recently Completed column.
2. **Given** the user completes a goal, **When** the Recently Completed column
   updates, **Then** the completed goal shows a "Completed [relative time]"
   label (e.g., "Completed just now").
3. **Given** the user had 4 active goals, **When** they complete one, **Then**
   the Active Goals count decreases to 3 and the active goals column updates
   accordingly.

---

### User Story 4 - Delete a Goal (Priority: P4)

A user decides a goal is no longer relevant and wants to permanently remove it.
From the goal's edit modal (accessed by clicking the goal card), the user clicks
"Delete Goal." A confirmation prompt appears. Upon confirming, the goal is
permanently removed from the system.

**Why this priority**: Deletion is a destructive action and lower priority than
the create/complete loop, but necessary for a usable product. It depends on
goals existing (US2).

**Independent Test**: With a pre-seeded goal, open its edit view, click Delete
Goal, confirm. Verify the goal no longer appears in either column.

**Acceptance Scenarios**:

1. **Given** an active goal exists, **When** the user clicks the goal card,
   **Then** an edit modal opens showing the goal title, end date, and a
   "Delete Goal" action.
2. **Given** the edit modal is open, **When** the user clicks "Delete Goal,"
   **Then** a confirmation prompt asks the user to confirm the deletion.
3. **Given** the confirmation prompt is shown, **When** the user confirms,
   **Then** the goal is permanently removed and no longer appears on the
   dashboard.
4. **Given** the confirmation prompt is shown, **When** the user cancels,
   **Then** the goal remains unchanged.

---

### User Story 5 - Edit an Existing Goal (Priority: P5)

A user wants to update the title or end date of an existing active goal. They
click on the goal card to open an edit modal pre-populated with the current
values. After making changes, they click "Save Changes" and the updated goal
reflects the new values on the dashboard.

**Why this priority**: Editing is a convenience feature. Users can work around
its absence by deleting and re-creating goals. It shares the edit modal
surface with US4 (delete).

**Independent Test**: Click an active goal to open the edit modal, change the
title and end date, save. Verify the updated values appear on the dashboard.

**Acceptance Scenarios**:

1. **Given** an active goal exists, **When** the user clicks the goal card,
   **Then** an edit modal opens pre-filled with the current title and end date.
2. **Given** the edit modal is open with modified values, **When** the user
   clicks "Save Changes," **Then** the modal closes and the dashboard reflects
   the updated title and/or end date.
3. **Given** the edit modal is open, **When** the user clicks Cancel, **Then**
   no changes are saved and the modal closes.

---

### Edge Cases

- What happens when a goal's end date is today? It MUST be treated as urgent
  (0 days left) and highlighted.
- What happens when a goal's end date has already passed but the goal was not
  completed? It MUST remain in the Active Goals column, highlighted as overdue,
  showing "Overdue" instead of a days-left count.
- What happens when the user has many active goals (e.g., 20+)? The Active
  Goals column MUST scroll vertically without breaking the layout.
- What happens when localStorage is full (demo mode)? The system MUST display
  a user-friendly error message explaining that storage is full.
- What happens when the storage environment variable is not set? The system
  MUST default to localStorage (demo mode).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a two-column dashboard layout: Active Goals
  (left) and Recently Completed (right).
- **FR-002**: Each active goal card MUST display the goal title and the number
  of calendar days remaining until the end date.
- **FR-003**: Active goals with 3 or fewer days remaining MUST be visually
  highlighted using urgent styling from the orange design system (e.g., red
  badge, colored border).
- **FR-004**: Active goals whose end date has passed MUST display "Overdue"
  and use distinct overdue styling.
- **FR-005**: Completed goals MUST appear in the Recently Completed column
  with a relative completion timestamp.
- **FR-006**: Users MUST be able to add a new goal via a modal dialog with
  Goal Title (required text, max 100 characters) and End Date (required,
  must be today or later) fields.
- **FR-007**: Users MUST be able to complete a goal by clicking a checkbox on
  the goal card, which moves it from Active to Recently Completed.
- **FR-008**: Users MUST be able to delete a goal permanently via a Delete
  action in the edit modal, preceded by a confirmation prompt.
- **FR-009**: Users MUST be able to edit an existing goal's title and end date
  via an edit modal accessed by clicking the goal card.
- **FR-010**: The system MUST persist goals using either localStorage or a
  database, controlled by an environment variable (`STORAGE_MODE` or similar).
- **FR-011**: When the environment variable is absent or set to "demo," the
  system MUST use localStorage. When set to "production," the system MUST
  use a database via server-side API routes.
- **FR-012**: The dashboard greeting MUST include the count of active goals
  (e.g., "You have 4 active goals to focus on today").
- **FR-013**: The UI MUST follow the orange/peach design system defined in the
  `/design/orange` folder, including the Radiant Editorial color palette,
  typography (Plus Jakarta Sans + Inter), no-line rule, and tonal layering.
- **FR-014**: The UI MUST be responsive across mobile (320px+), tablet (768px+),
  and desktop (1280px+) viewports.

### Key Entities

- **Goal**: Represents a user objective. Attributes: unique identifier, title
  (text), end date (date), status (active or completed), completion timestamp
  (date/time, set when completed), creation timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new goal in under 30 seconds (open modal,
  fill two fields, submit).
- **SC-002**: Users can visually distinguish urgent goals (3 days or fewer)
  from non-urgent goals at a glance without reading the days-left number.
- **SC-003**: Completing a goal (checkbox click to column move) takes a single
  interaction with immediate visual feedback (under 1 second perceived).
- **SC-004**: The dashboard loads and displays all goals within 2 seconds on a
  standard broadband connection.
- **SC-005**: The application is fully usable on a 375px-wide mobile screen
  without horizontal scrolling or content truncation.
- **SC-006**: Switching between demo (localStorage) and production (database)
  storage requires only changing an environment variable, with no code changes.

## Assumptions

- This is a single-user application; there is no authentication, user accounts,
  or multi-user data isolation in this initial version.
- The navigation items visible in the design mockups (Analytics, Community,
  notifications, settings, profile) are out of scope for this feature; only the
  Dashboard view is implemented.
- The "Focus Area" chips (Professional, Personal) shown in the design mockups
  are out of scope for this initial version; goals have only a title and end
  date.
- The "Pro Tip" card shown in the design is out of scope for this initial setup.
- The greeting ("Good morning, Alex") will use a generic greeting or a hardcoded
  name, since there is no user authentication.
- Goals are sorted by urgency (fewest days remaining first) in the Active Goals
  column by default.
- The Recently Completed column shows the most recent completions first, with
  no pagination needed for the initial version.
