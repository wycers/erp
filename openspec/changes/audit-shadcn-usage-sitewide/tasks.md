## 1. Baseline and Planning

- [ ] 1.1 Create a route-level UI compliance inventory for `src/routes/+page.svelte` and all `src/routes/erp/**` pages, marking current primitive usage vs. ad hoc controls.
- [ ] 1.2 Define and document the compliance baseline (which control/state patterns must use shared `src/lib/components/ui` primitives).
- [ ] 1.3 Identify missing shared primitives/wrappers required for ERP migration (for example `Textarea`, table shell, status/alert container).

## 2. Shared UI Foundation

- [ ] 2.1 Implement or finalize missing primitives/wrappers in `src/lib/components/ui/**` with variants aligned to existing token conventions.
- [ ] 2.2 Refactor duplicated status and message blocks into reusable component patterns consumed by ERP pages.
- [ ] 2.3 Export and document new/updated UI primitives so route files consume consistent imports.

## 3. Route Migration

- [ ] 3.1 Migrate `src/routes/erp/+layout.svelte` and `src/routes/erp/+page.svelte` navigation and summary cards to shared primitives.
- [ ] 3.2 Migrate ERP master pages (`materials`, `products`) to shared button/input/textarea/card patterns without changing form actions or data behavior.
- [ ] 3.3 Migrate ERP transaction pages (`purchases`, `production`, `sales`, `inventory`) to shared primitives for actions, forms, and status blocks.
- [ ] 3.4 Migrate `src/routes/+page.svelte` landing actions to shared button/card primitives.

## 4. Validation

- [ ] 4.1 Run `npm run check` and resolve migration-introduced type or Svelte diagnostics.
- [ ] 4.2 Execute manual smoke checks for ERP navigation, create/update actions, and status feedback on migrated routes.
- [ ] 4.3 Record compliance verification evidence for each migrated route group before merge.

## 5. Guardrails

- [ ] 5.1 Add a short contributor guideline mapping common raw controls to approved shared primitives for future route work.
- [ ] 5.2 Add a lightweight regression check (script or checklist gate) to prevent reintroduction of ad hoc UI patterns in `src/routes/erp/**`.
