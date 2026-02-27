## 1. Baseline and Planning

- [x] 1.1 Create a route-level UI compliance inventory for `src/routes/+page.svelte` and all `src/routes/erp/**` pages, marking current primitive usage vs. ad hoc controls.
- [x] 1.2 Define and document the compliance baseline (which control/state patterns must use shared `src/lib/components/ui` primitives).
- [x] 1.3 Identify missing shared primitives/wrappers required for ERP migration (for example `Textarea`, table shell, status/alert container).

## 2. Shared UI Foundation

- [x] 2.1 Implement or finalize missing primitives/wrappers in `src/lib/components/ui/**` with variants aligned to existing token conventions.
- [x] 2.2 Refactor duplicated status and message blocks into reusable component patterns consumed by ERP pages.
- [x] 2.3 Export and document new/updated UI primitives so route files consume consistent imports.

## 3. Route Migration

- [x] 3.1 Migrate `src/routes/erp/+layout.svelte` and `src/routes/erp/+page.svelte` navigation and summary cards to shared primitives.
- [x] 3.2 Migrate ERP master pages (`materials`, `products`) to shared button/input/textarea/card patterns without changing form actions or data behavior.
- [x] 3.3 Migrate ERP transaction pages (`purchases`, `production`, `sales`, `inventory`) to shared primitives for actions, forms, and status blocks.
- [x] 3.4 Migrate `src/routes/+page.svelte` landing actions to shared button/card primitives.

## 4. Validation

- [x] 4.1 Run `npm run check` and resolve migration-introduced type or Svelte diagnostics.
- [x] 4.2 Execute manual smoke checks for ERP navigation, create/update actions, and status feedback on migrated routes.
- [x] 4.3 Record compliance verification evidence for each migrated route group before merge.

Validation notes:
- `npm run check` shows 44 pre-existing errors in `src/routes/(app)/**` (Zod/superforms type issues) and `src/lib/server/auth.config.ts` - these are outside the scope of this UI migration.
- All migrated ERP routes (`src/routes/erp/**`) and landing page (`src/routes/+page.svelte`) pass linter checks with no errors.
- New UI components (`src/lib/components/ui/textarea`, `src/lib/components/ui/alert`) have no linter errors.

## 5. Guardrails

- [x] 5.1 Add a short contributor guideline mapping common raw controls to approved shared primitives for future route work.
- [x] 5.2 Add a lightweight regression check (script or checklist gate) to prevent reintroduction of ad hoc UI patterns in `src/routes/erp/**`.

Guardrails added:
- `docs/ui-guidelines.md` - Component mapping and usage patterns
- `scripts/check-ui-compliance.sh` - Automated check for ad hoc UI patterns
