## ADDED Requirements

### Requirement: ERP core routes MUST use Superforms for business forms
The system MUST implement business form workflows on `/erp/products`, `/erp/purchases`, `/erp/sales`, and `/erp/production` using `sveltekit-superforms` on both server and client.

#### Scenario: Route form implementation baseline
- **WHEN** a core ERP route renders a create, update, post, or draft form
- **THEN** the route MUST initialize and submit the form through Superforms APIs rather than manual `request.formData()` parsing as the primary path

### Requirement: Server actions SHALL validate inputs through zod schemas
The system SHALL define explicit zod schemas for migrated ERP form actions, including required fields, type coercion, and normalization rules.

#### Scenario: Validation failure returns structured form errors
- **WHEN** a user submits invalid input on a migrated ERP form
- **THEN** the corresponding action MUST return validation errors in the Superforms form payload with field-level error information

#### Scenario: Valid payload reaches existing domain logic
- **WHEN** a user submits schema-valid input
- **THEN** the action MUST pass normalized values to existing domain/application services without changing business semantics

### Requirement: Form failure handling SHALL preserve user input and action identity
The system SHALL preserve submitted values on failed submissions and include action identity metadata so the UI can bind feedback to the correct form instance.

#### Scenario: Single-form route failure feedback
- **WHEN** a submission fails on a single-form page
- **THEN** the page MUST re-render with the submitted values and field errors for that same form

#### Scenario: Multi-instance form failure feedback
- **WHEN** a submission fails for one editable item in a list/table
- **THEN** the response MUST include enough action identity to render errors on the triggering item only

### Requirement: UX semantics MUST remain equivalent during migration
The system MUST keep existing success outcomes, business error meaning, and persisted data behavior equivalent to pre-migration flows.

#### Scenario: Success behavior parity
- **WHEN** a migrated action succeeds
- **THEN** the user-visible success behavior (state transition, message, redirect or refresh semantics) MUST remain equivalent to the previous implementation

#### Scenario: Business error parity
- **WHEN** domain or storage constraints fail (for example duplicate keys or invalid state transitions)
- **THEN** the user MUST still receive understandable business error feedback equivalent in meaning to the previous implementation

### Requirement: New ERP forms SHALL follow the Superforms baseline
The system SHALL treat Superforms as the default standard for newly added ERP business forms after this migration.

#### Scenario: New ERP form introduction
- **WHEN** a new ERP route or major ERP form workflow is introduced
- **THEN** it MUST implement server validation and client binding using the established Superforms + zod baseline
