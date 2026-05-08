<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0
Modified principles: N/A (initial ratification)
Added sections:
  - Core Principles (5 principles)
  - Tech Stack & Storage
  - API Conventions & Testing Policy
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ No changes required; Constitution Check section
    already generic. Testing field now explicitly says "None (prohibited by constitution)".
  - .specify/templates/spec-template.md ✅ No changes required; testing references are
    already marked OPTIONAL.
  - .specify/templates/tasks-template.md ✅ No changes required; test tasks already marked
    OPTIONAL with explicit NOTE.
Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Confirm exact project start date if different from 2026-05-08.
-->

# DoIt SpecKit Constitution

## Core Principles

### I. Clean Code

Every module, function, and variable MUST have a single, clear responsibility.
Names MUST be descriptive and self-documenting — abbreviations and single-letter
identifiers are prohibited outside of well-established loop counters (`i`, `j`).
Functions MUST remain small (≤ 40 lines as a guide); extract when logic grows.
DRY applies within a module; do NOT create premature cross-module abstractions for
code used fewer than three times. Dead code MUST be deleted, not commented out.

**Rationale**: Readable, maintainable code reduces onboarding time and defect rate
more reliably than any tooling or process layer.

### II. Simple UX

Interfaces MUST prioritize clarity over visual sophistication. Each screen or view
MUST expose only the controls relevant to the current user task — secondary actions
belong in menus or progressive-disclosure patterns, not the primary viewport.
Modals MUST be used sparingly and only for actions that require focused attention
with an explicit confirm/cancel boundary. Error messages MUST be written in plain
language and tell the user what to do next, not only what went wrong.

**Rationale**: Users abandon complex UIs. Simplicity lowers support burden and
improves task-completion rates without requiring user training.

### III. Responsive Design

All UI MUST render correctly and usably at mobile (≥ 320 px), tablet (≥ 768 px),
and desktop (≥ 1280 px) breakpoints. Tailwind responsive utility classes MUST be
the primary mechanism for layout adaptation — fixed pixel widths on layout containers
are prohibited. Touch targets MUST meet a minimum size of 44 × 44 px on mobile.
Images and media MUST use fluid sizing (`max-w-full`, `object-cover`, etc.).

**Rationale**: A significant share of users access applications on non-desktop
devices. Responsive-first development prevents costly retrofits.

### IV. Minimal Dependencies

Every external package added to the project MUST be justified with a written reason
in the PR description. Packages MUST NOT be added to solve problems that the
framework (Next.js, NestJS, React) or the language standard library already solves
adequately. Utility libraries (e.g., lodash, date-fns) MUST only be introduced when
the native alternative requires significantly more code or is demonstrably error-prone.
Dependencies that are no longer used MUST be removed immediately.

**Rationale**: Each dependency is a surface area for vulnerabilities, breaking
changes, and build-time bloat. Small dependency trees are easier to audit and update.

### V. Code Style

All TypeScript MUST be compiled in strict mode (`"strict": true` in `tsconfig.json`).
`any` is prohibited; use `unknown` with type guards, generics, or discriminated
unions instead. ESLint MUST be configured with the project's shared ruleset and
MUST pass with zero warnings. Prettier MUST be used for all formatting — no
manual formatting overrides. All linting and formatting MUST pass before a PR
can be merged.

**Rationale**: Strict typing eliminates entire categories of runtime errors.
Automated formatting removes style debates from code review.

## Tech Stack & Storage

**Backend API**: NestJS (Node.js). Controllers MUST be thin; business logic belongs
in injectable services. NestJS modules MUST reflect domain boundaries, not file-type
groupings.

**Frontend**: Next.js (App Router) + React + Tailwind CSS + shadcn/ui. Components
from shadcn MUST be preferred over custom implementations for standard UI primitives
(buttons, inputs, dialogs, etc.). Custom components are justified only when shadcn
has no equivalent or the design requirement materially diverges.

**Storage**:
- *Demo / local mode*: `localStorage` for client-side persistence. Keys MUST be
  namespaced (e.g., `speckit:featureName:key`) to avoid collisions.
- *Production*: PostgreSQL accessed via Next.js API routes. Direct database calls
  from client components are prohibited; all DB access MUST go through server-side
  API routes.

## API Conventions & Testing Policy

**API Design**: All endpoints MUST follow RESTful conventions (noun-based resource
paths, correct HTTP verbs, stateless requests). All responses MUST use JSON with a
consistent envelope shape. HTTP status codes MUST accurately reflect the outcome
(200/201 for success, 4xx for client errors, 5xx for server errors). Error responses
MUST include a machine-readable `code` field and a human-readable `message` field.

**Testing Policy (NON-NEGOTIABLE)**: This project operates with a zero-testing
mandate. There MUST be NO unit tests, NO integration tests, and NO end-to-end tests
of any kind. Test files MUST NOT be created, committed, or referenced in task lists
or implementation plans. Test frameworks (Jest, Vitest, Playwright, Cypress, etc.)
MUST NOT be installed as dependencies. Quality assurance relies on strict TypeScript,
ESLint, code review, and manual verification against acceptance scenarios defined in
specs.

**Rationale**: The team has made an explicit, informed decision to invest effort in
types and review rather than automated test suites for this project.

## Governance

This constitution MUST supersede all other project guidance, README conventions,
framework defaults, and agent default behaviors where they conflict.

Amendments require:
1. A written proposal describing the change and its rationale.
2. Increment of `CONSTITUTION_VERSION` following semantic versioning:
   - **MAJOR**: Principle removed, redefined, or made backward-incompatible.
   - **MINOR**: New principle or section added; material expansion of guidance.
   - **PATCH**: Clarification, wording refinement, or typo fix.
3. Update of `LAST_AMENDED_DATE` to the amendment date (ISO format).
4. Propagation check across all `.specify/templates/` files.

All implementation plans MUST include a Constitution Check gate that verifies
compliance with the active principles before work begins.

**Version**: 1.0.0 | **Ratified**: 2026-05-08 | **Last Amended**: 2026-05-08
