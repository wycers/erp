## Why

The current UI implementation is inconsistent: some pages use shadcn-style primitives from `src/lib/components/ui`, while major ERP pages still use hand-authored Tailwind classes and raw HTML controls. This makes design language, accessibility behavior, and maintenance inconsistent across the product.

## What Changes

- Define and document a site-wide shadcn usage baseline for routes and shared UI patterns.
- Audit current routes/components and classify what is already compliant vs. what still relies on ad hoc styling.
- Migrate ERP-facing pages (`/erp/**`) and landing entry points to shadcn primitives (`Button`, `Input`, `Card`, `Badge`, `Separator`, and related wrappers) where equivalent controls exist.
- Standardize shared layout/form/table states (empty, loading, error, success) using reusable UI component patterns rather than per-page custom class combinations.
- Add a verification checklist and guardrails so new pages follow the same component conventions.

## Capabilities

### New Capabilities
- `ui-system-consistency`: enforce consistent usage of shadcn-based UI primitives and tokenized styling across all user-facing pages.

### Modified Capabilities
- None.

## Impact

- Affected code:
  - `src/routes/+page.svelte`
  - `src/routes/erp/**`
  - `src/lib/components/ui/**` (potential extensions for missing primitives/wrappers)
  - `src/routes/layout.css` and any shared style utilities
- Affected behavior:
  - Visual and interaction consistency across navigation, forms, actions, and state messaging
  - More uniform accessibility attributes and focus/disabled states via shared components
- Dependencies/systems:
  - Continue using existing `bits-ui`, `tailwind-variants`, and Tailwind token setup
  - No backend/data model changes expected
