## ADDED Requirements

### Requirement: Support Decimal Quantities and Two-Decimal Values

The system SHALL support decimal quantities and SHALL store/display quantity, unit cost, and monetary totals using two-decimal precision in this phase.

#### Scenario: Persist decimal quantities and values

- **WHEN** a user records purchase, production, or sales quantities and values with decimals
- **THEN** the system accepts and persists values to two-decimal precision

### Requirement: Enforce Non-Negative Inventory

The system SHALL reject any posting operation that would cause on-hand inventory to fall below zero for any SKU.

#### Scenario: Reject underflow movement

- **WHEN** a purchase-independent outbound movement (production consume or sales ship) would reduce a SKU below zero quantity
- **THEN** the system blocks posting and returns an inventory insufficient error

### Requirement: Maintain Moving Weighted Average Cost

The system SHALL maintain moving weighted average cost per SKU, updating average cost on inbound movements and using current average cost for outbound movements.

#### Scenario: Update average cost on inbound movement

- **WHEN** an inbound movement posts for a SKU with existing on-hand quantity and average cost
- **THEN** the system recalculates average cost as `((old qty * old avg cost) + (inbound qty * inbound unit cost)) / (old qty + inbound qty)`

#### Scenario: Use average cost on outbound movement

- **WHEN** an outbound movement posts for a SKU
- **THEN** the system values the outbound movement at current SKU average cost
- **AND** does not recalculate average cost from outbound movement alone

### Requirement: Provide SKU-Centric Inventory Traceability

The system SHALL provide SKU-level inventory views that show related inbound/outbound documents and resulting inventory balances.

#### Scenario: View SKU transaction chain

- **WHEN** a user opens inventory details for a SKU
- **THEN** the system displays linked purchase, production, and sales document references with movement direction, quantity, and valuation values
