<!--
  Sync Impact Report
  ==================
  Version change: N/A (new) → 1.0.0
  Modified principles: N/A (initial ratification)
  Added sections:
    - Principle I: Clean Code
    - Principle II: Simple UX
    - Principle III: Responsive Design
    - Principle IV: Minimal Dependencies
    - Principle V: No Testing (NON-NEGOTIABLE)
    - Technology Stack (Section 2)
    - Development Workflow (Section 3)
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md ⚠ pending
      (Testing field in Technical Context should default to "None —
      constitution prohibits tests"; test directory references in
      Project Structure should be removed when generating plans)
    - .specify/templates/spec-template.md ⚠ pending
      (Section title "User Scenarios & Testing" references testing;
      "Independent Test" fields reference testing — downstream
      commands must omit test-related acceptance criteria)
    - .specify/templates/tasks-template.md ⚠ pending
      (Test task examples and "Tests for User Story" subsections
      must be omitted when generating tasks; "Verify tests fail
      before implementing" note must be removed)
  Follow-up TODOs: None
-->

# Claude Speckit Constitution

## Core Principles

### I. Clean Code

All code MUST be readable, well-structured, and self-documenting.
Specific rules:

- Functions MUST do one thing and do it well.
- Names MUST be descriptive and unambiguous — no abbreviations
  unless universally understood (e.g., `id`, `url`).
- Files MUST have a single, clear responsibility.
- Dead code, commented-out code, and unused imports MUST be
  removed immediately.
- Duplication MUST be eliminated only when three or more
  instances exist; premature abstraction is prohibited.
- Code MUST pass ESLint with the project's configured rules
  before being considered complete.

### II. Simple UX

Every user-facing feature MUST prioritize clarity and ease of use
over feature richness.

- Interfaces MUST be intuitive enough that no documentation is
  needed for core workflows.
- Each screen or component MUST have a single primary action that
  is visually dominant.
- Loading states, empty states, and error states MUST be handled
  explicitly in every user-facing component.
- Navigation MUST be shallow — no more than two levels deep from
  any entry point.
- Visual noise MUST be minimized: whitespace is preferred over
  borders, dividers, and decorations.

### III. Responsive Design

All pages and components MUST render correctly across mobile,
tablet, and desktop viewports.

- Layouts MUST use Tailwind CSS utility classes with a
  mobile-first approach (`sm:`, `md:`, `lg:` breakpoints).
- Touch targets MUST be at least 44x44 CSS pixels on mobile.
- Typography MUST scale fluidly — no fixed pixel font sizes for
  body text.
- Images and media MUST be responsive and never overflow their
  containers.
- Every page MUST be visually verified at 320px, 768px, and
  1280px widths before being considered complete.

### IV. Minimal Dependencies

The project MUST keep its dependency footprint as small as
possible.

- New `npm` packages MUST NOT be added without explicit
  justification that the functionality cannot be achieved with
  Next.js, React, or Tailwind CSS built-in capabilities.
- The core stack is fixed: **Next.js ^16.2.0**, **React ^19.2.4**,
  **Tailwind CSS ^4**, and **TypeScript ^5**. These are the only
  runtime and styling dependencies permitted by default.
- Utility libraries (e.g., lodash, moment) are prohibited when
  native JavaScript or existing framework APIs suffice.
- Every dependency MUST be reviewed for bundle size impact before
  adoption.
- DevDependencies for linting and type-checking are permitted but
  MUST be kept to the minimum necessary set.

### V. No Testing (NON-NEGOTIABLE)

**This principle supersedes all other guidance, templates, and
tooling defaults.**

- The project MUST NOT contain unit tests, integration tests,
  end-to-end tests, contract tests, or any other form of
  automated test.
- No test runner, test framework, or test utility (e.g., Jest,
  Vitest, Playwright, Cypress, Testing Library) MUST be installed
  as a dependency.
- No `tests/`, `__tests__/`, `*.test.*`, or `*.spec.*` files or
  directories MUST exist in the repository.
- Task generation and planning tools MUST omit all test-related
  tasks, phases, and checkpoints.
- Code review and quality assurance rely on ESLint, TypeScript
  type-checking, and manual verification only.

## Technology Stack

The following technology versions are mandated by this
constitution and MUST NOT be changed without a constitutional
amendment:

| Technology   | Version   | Purpose              |
|--------------|-----------|----------------------|
| Next.js      | ^16.2.0   | Application framework|
| React        | ^19.2.4   | UI library           |
| React DOM    | ^19.2.4   | DOM rendering        |
| Tailwind CSS | ^4        | Styling              |
| TypeScript   | ^5        | Type safety          |
| ESLint       | ^9        | Code quality         |

Additional constraints:

- The Next.js App Router MUST be used (no Pages Router).
- Server Components MUST be the default; Client Components
  (`"use client"`) are permitted only when browser APIs or
  interactivity require them.
- Tailwind MUST be the sole styling mechanism — no CSS modules,
  styled-components, or inline style objects unless Tailwind
  cannot express the requirement.

## Development Workflow

Quality gates and workflow rules for all contributors:

1. **Lint before commit**: All code MUST pass `eslint` with zero
   errors before being committed.
2. **Type-check before commit**: `tsc --noEmit` MUST pass with
   zero errors.
3. **Manual verification**: Every user-facing change MUST be
   manually verified at mobile (320px), tablet (768px), and
   desktop (1280px) viewports.
4. **Dependency review**: Any new dependency addition MUST be
   justified in the commit message or PR description.
5. **No test artifacts**: Commits MUST NOT introduce test files,
   test configurations, or test dependencies. If a template or
   tool generates test artifacts, they MUST be removed before
   committing.

## Governance

This constitution is the supreme governing document for the
Gemini project. All development practices, tooling defaults,
and template outputs MUST comply with its principles.

- **Supremacy**: Where any template, tool, or external guidance
  conflicts with this constitution, the constitution prevails.
- **Amendments**: Changes require updating this document,
  incrementing the version per semantic versioning, recording the
  amendment date, and propagating changes to all dependent
  templates.
- **Versioning policy**: MAJOR for principle removals or
  redefinitions; MINOR for new principles or material expansions;
  PATCH for clarifications and wording fixes.
- **Compliance review**: All PRs and code reviews MUST verify
  adherence to constitutional principles. Non-compliance MUST be
  flagged and resolved before merge.

**Version**: 1.0.0 | **Ratified**: 2026-03-24 | **Last Amended**: 2026-03-24
