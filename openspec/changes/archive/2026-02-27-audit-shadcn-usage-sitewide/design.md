## Context

The codebase currently has two UI patterns in active use:
- Newer routes (notably under `src/routes/(app)/**`, plus some public pages) use shared shadcn-style components from `src/lib/components/ui` and tokenized classes.
- ERP routes under `src/routes/erp/**` and the root landing page still use raw HTML elements with page-specific Tailwind class sets (`bg-blue-*`, `border-gray-*`, etc.).

This split increases maintenance cost, creates inconsistent focus/disabled/error states, and makes future UX updates harder to roll out globally.

## Goals / Non-Goals

**Goals:**
- Establish a clear, testable baseline for what "uses shadcn" means at route/component level.
- Migrate ERP and landing experience to shared UI primitives and tokenized styles.
- Reduce one-off utility-class duplication by promoting reusable wrappers for common patterns (form fields, action bars, table shells, status messages).
- Keep behavior and data workflows unchanged while improving UI consistency.

**Non-Goals:**
- Redesign ERP business workflows or change server/data logic.
- Introduce a full new design system beyond current shadcn + Tailwind token stack.
- Migrate third-party/demo visual experiments that are intentionally custom unless they violate baseline accessibility and interaction rules.

## Decisions

- Decision: Define compliance at the "interaction primitive" level (buttons, inputs, badges, separators, cards, status containers) rather than forcing 100% class elimination.
  - Rationale: shadcn components still allow class customization; strict "no utility class" rules are impractical.
  - Alternative considered: Require every element to be a shadcn component with zero local utility classes.
  - Why not alternative: This blocks legitimate layout/spacing concerns and slows delivery without measurable UX gain.

- Decision: Migrate in slices by route area, starting with `/erp/**`, then root landing page.
  - Rationale: `/erp/**` contains the highest concentration of inconsistent UI and user-critical workflows.
  - Alternative considered: Big-bang migration of all routes in one pass.
  - Why not alternative: Higher regression risk and poor rollback granularity.

- Decision: Extend `src/lib/components/ui/**` only when required primitives are missing (for example `Textarea`, standardized table wrappers, alert/status container).
  - Rationale: Prefer reuse and keep page files focused on behavior rather than repetitive style glue.
  - Alternative considered: Keep all ERP-specific styles inline and skip new wrappers.
  - Why not alternative: Per-page duplication recreates the current inconsistency problem.

- Decision: Preserve route URLs, form actions, and server contract; this change is presentational and interaction-consistency focused.
  - Rationale: Limits scope and risk for a UI standardization change.
  - Alternative considered: Combine UI migration with workflow/schema refactors.
  - Why not alternative: Coupled rollout makes root-cause analysis and rollback harder.

- Decision: Add a lightweight verification checklist that must pass before merge (component usage checks + visual smoke validation on key routes).
  - Rationale: Prevents regression back to ad hoc UI patterns.
  - Alternative considered: Rely only on manual reviewer judgment.
  - Why not alternative: Subjective enforcement drifts over time.

## Risks / Trade-offs

- [Risk] Visual regressions in dense ERP tables/forms during component replacement. -> Mitigation: route-by-route migration with screenshots/manual QA checklist before moving to next area.
- [Risk] Missing primitives in current UI library may force ad hoc classes during migration. -> Mitigation: create minimal shared wrappers first, then consume them in routes.
- [Risk] Team velocity dip while learning/enforcing baseline rules. -> Mitigation: document mapping rules (raw element -> preferred primitive) and provide copyable examples.
- [Risk] False confidence from static class checks alone. -> Mitigation: pair static checks with runtime smoke checks on major flows.

## Migration Plan

1. Create a route/component audit baseline and identify non-compliant files.
2. Add any missing shared primitives/wrappers in `src/lib/components/ui/**`.
3. Migrate `/erp/+layout.svelte`, `/erp/+page.svelte`, then each `/erp/*` workflow page group.
4. Migrate `src/routes/+page.svelte` to the same primitive set.
5. Run `npm run check` and targeted manual smoke tests for ERP navigation, form submit, and state messaging.
6. Record compliance results and follow-up gaps.

Rollback strategy:
- Revert migration commits route-group by route-group if UX regressions are discovered.
- Because backend contracts are unchanged, rollback is code-only and low operational risk.

## Open Questions

- Should demo-auth pages keep custom branded gradients, or should they also adopt the same strict primitive baseline?
- Do we want an automated lint rule/script for banned class patterns in route files, or keep the checklist/manual review only in this phase?
