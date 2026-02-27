## ADDED Requirements

### Requirement: Post Finished-Goods Sales Shipments

The system SHALL support posting sales shipments for finished products with decimal quantity and selling price, and SHALL create finished-goods outbound inventory movements.

#### Scenario: Post sales shipment

- **WHEN** a user posts a sales shipment line for a finished product with quantity and selling price
- **THEN** the system decreases finished-goods on-hand quantity
- **AND** records outbound inventory ledger entries linked to the sales document
- **AND** rejects posting if shipment quantity would cause negative finished-goods inventory

### Requirement: Calculate COGS and Gross Profit per Sales Posting

The system SHALL calculate shipment revenue, COGS, gross profit, and gross margin at posting time using finished-goods average inventory cost from `inventory-costing`.

#### Scenario: Compute shipment profitability

- **WHEN** a sales shipment is posted
- **THEN** revenue is calculated from quantity and selling price
- **AND** COGS is calculated from quantity and current finished-goods average cost
- **AND** gross profit is calculated as `revenue - COGS`
- **AND** gross margin is calculated as `gross profit / revenue` when revenue is greater than zero
