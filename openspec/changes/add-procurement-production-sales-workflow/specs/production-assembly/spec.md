## ADDED Requirements

### Requirement: Enforce One Fixed BOM per Finished Product

The system SHALL allow exactly one active BOM definition per finished product in this phase.

#### Scenario: Prevent multiple active BOM definitions

- **WHEN** a user attempts to create or activate a second BOM for the same finished product
- **THEN** the system rejects the change and keeps only one active BOM

### Requirement: Post Production Orders from Fixed BOM

The system SHALL post production by consuming material SKUs from the fixed BOM and receiving finished goods inventory for the produced quantity.

#### Scenario: Post production order successfully

- **WHEN** a user posts a production order for a finished product and output quantity
- **THEN** the system derives component consumption quantities from the fixed BOM
- **AND** consumes required material inventory using current material average costs defined in `inventory-costing`
- **AND** creates inbound finished-goods inventory for the produced quantity
- **AND** sets finished-goods unit cost as `total consumed material cost / produced quantity`

#### Scenario: Reject production posting when components are insufficient

- **WHEN** required material component quantity is unavailable for a production posting
- **THEN** the system blocks the posting under non-negative inventory rules
