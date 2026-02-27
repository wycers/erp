## ADDED Requirements

### Requirement: Create Purchase Orders with Freight-Inclusive Landed Cost

The system SHALL support purchase orders identified by order number, with one or more lines containing material SKU, decimal quantity, and line amount, and SHALL compute landed line unit costs by allocating freight proportionally by line amount.

#### Scenario: Calculate unit price and landed cost per purchase line

- **WHEN** a user saves a purchase order with freight amount and multiple lines of quantity and line amount
- **THEN** the system calculates each line unit price as `line amount / quantity`
- **AND** allocates freight by each line's proportion of total line amount
- **AND** calculates each line landed unit cost from `(line amount + allocated freight) / quantity`
- **AND** assigns any rounding residual from freight allocation to the last line

### Requirement: Post Purchase Orders into Inventory

The system SHALL create inventory inbound ledger movements for posted purchase lines and SHALL link those movements back to the source purchase order and line.

#### Scenario: Post a purchase order

- **WHEN** a user posts a valid purchase order
- **THEN** the system increases on-hand quantity for each referenced material SKU
- **AND** records inventory ledger inbound entries linked to the purchase order
- **AND** updates SKU moving weighted average cost according to `inventory-costing` rules
