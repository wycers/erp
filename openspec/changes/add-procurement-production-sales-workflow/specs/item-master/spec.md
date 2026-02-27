## ADDED Requirements

### Requirement: Maintain Material SKU Master Data

The system SHALL allow users to create and maintain purchasable material SKUs before creating purchase documents.

#### Scenario: Create a material SKU with image and notes

- **WHEN** a user creates a new material SKU with identifier, name, optional image, and optional text note
- **THEN** the system stores the material SKU as selectable input for purchase and BOM documents

#### Scenario: Update material SKU annotations

- **WHEN** a user updates the image or text note for an existing material SKU
- **THEN** the system persists the updated annotations without changing historical transaction records

### Requirement: Maintain Finished Product Master Data

The system SHALL allow users to create and maintain sellable finished products that are separate from material SKUs.

#### Scenario: Create a finished product

- **WHEN** a user creates a finished product with identifier and name
- **THEN** the system stores it as a product that can receive production inbound and sales outbound transactions
