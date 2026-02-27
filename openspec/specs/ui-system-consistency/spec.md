## ADDED Requirements

### Requirement: Use shared UI primitives for core interactions
The system SHALL implement user-interaction controls through shared shadcn-style UI primitives rather than page-specific raw element styling.

#### Scenario: Render actionable controls on ERP pages
- **WHEN** a page under `/erp/**` renders primary or secondary user actions (for example submit, navigate, cancel, post)
- **THEN** those actions MUST use shared button primitives from `src/lib/components/ui` (or wrappers built on top of them)

#### Scenario: Render editable form fields on ERP pages
- **WHEN** a page under `/erp/**` renders text-like form input controls
- **THEN** those controls MUST use shared form primitives (`Input`, `Textarea`, or approved wrappers) instead of ad hoc class-only raw controls

### Requirement: Route-level UI consistency baseline
The system SHALL define and apply a route-level baseline for shadcn compliance across user-facing pages.

#### Scenario: Baseline includes high-traffic pages
- **WHEN** the compliance baseline is established
- **THEN** it MUST include `src/routes/+page.svelte` and all route files under `src/routes/erp/**`

#### Scenario: Shared states follow a reusable pattern
- **WHEN** a page displays empty, success, warning, or error states
- **THEN** it MUST render these states through shared patterns/components so visual semantics are consistent between routes

### Requirement: Verify compliance before merge
The system SHALL provide a repeatable verification step that confirms migrated pages meet the baseline.

#### Scenario: Validate migration output
- **WHEN** a UI migration PR is prepared for merge
- **THEN** the change MUST include evidence of baseline verification for each migrated route group

#### Scenario: Guard against regression
- **WHEN** new ERP UI pages or major route updates are added after this change
- **THEN** the same baseline verification MUST be executed to prevent reintroduction of ad hoc UI patterns
