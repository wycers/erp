## Context

The repository currently contains only scaffold/demo functionality (auth + starter table). The requested change introduces the first real ERP domain flow: procure materials, hold inventory with cost, assemble finished products, and sell them with profit tracking.

## Goals / Non-Goals

- Goals:
  - Support end-to-end flow: material purchase -> inventory -> production to finished goods -> finished goods sales.
  - Keep costs deterministic using moving weighted average.
  - Keep posting safe by preventing negative inventory.
  - Support decimal quantities and two-decimal precision as confirmed by the user.
- Non-Goals:
  - Returns, corrections, and reversal documents.
  - Advanced planning (MRP), supplier settlement, or tax/VAT modules.
  - Multi-warehouse, lot tracking, or serial tracking.

## Decisions

- Decision: Split master data into material SKUs and finished products.
  - Rationale: Purchasing and production consume materials, while sales ship finished goods. Separation keeps BOM and costing logic explicit.

- Decision: Enforce exactly one fixed BOM per finished product in this phase.
  - Rationale: User confirmed fixed recipe only; this minimizes versioning complexity.

- Decision: Use draft/post transactional model for purchase, production, and sales documents.
  - Rationale: Costing and inventory should update only on post, ensuring deterministic ledgers and easier auditability.

- Decision: Use moving weighted average costing for all SKU inventories.
  - Rationale: User selected weighted average and needs consistent cost basis for COGS and profit.

- Decision: Allocate purchase freight by line amount proportion.
  - Rationale: User confirmed this rule. Freight enters landed cost and therefore inventory valuation.

- Decision: Production first receives finished goods inventory; sales then ship finished goods inventory.
  - Rationale: User explicitly chose two-step inventory movement rather than direct BOM issue at sales time.

- Decision: Precision policy is two decimals for quantity and monetary fields in this phase.
  - Rationale: User requested decimal support and confirmed two decimals are sufficient.

## Data and Posting Model

- Item master:
  - Material SKU: code/name, optional image, optional note, active state.
  - Finished product: code/name, optional note, active state.
  - BOM: one active BOM per finished product, BOM lines (material SKU + quantity per unit).
- Transaction documents:
  - Purchase order: header (order number, freight amount), lines (material SKU, quantity, line amount).
  - Production order: header (finished product, output quantity), derived component consumption lines.
  - Sales shipment: header/lines (finished product, quantity, selling unit price).
- Inventory ledger:
  - Inbound/outbound movements linked to source documents (purchase, production, sales).
  - Running quantity and valuation metrics used for SKU-level traceability and reporting.

## Costing Rules

- Purchase:
  - Line unit price = line amount / quantity.
  - Freight is allocated to each line by line amount proportion, with rounding residual assigned to the last line.
  - Landed line unit cost = (line amount + allocated freight) / quantity.
- Moving weighted average:
  - Inbound updates average cost.
  - Outbound uses current average cost as issue cost and does not recalculate average.
- Production:
  - Material issues use current material average cost.
  - Finished goods unit cost = total consumed material cost / produced quantity.
- Sales:
  - COGS uses finished goods average cost at posting time.
  - Gross profit = revenue - COGS.

## Risks / Trade-offs

- Two-decimal quantity precision may be insufficient for some domains (for example, fine-grained weight units).
  - Mitigation: keep precision policy centralized to allow future extension.
- No return/reversal flow means operational correction requires future change.
  - Mitigation: explicitly constrain scope now and follow with dedicated reversal proposal later.
- Weighted average is simple and stable, but does not preserve layer-level margin analytics like FIFO.
  - Mitigation: keep ledger granularity so alternate costing can be introduced later if needed.

## Migration Plan

1. Add master/transaction/ledger schema and migration scripts.
2. Introduce posting services with idempotent validation around non-negative inventory.
3. Add route-level workflows for item setup, purchase, inventory view, production, and sales.
4. Add tests for posting, costing math, and underflow protections.
5. Release behind normal auth-protected routes.

## Open Questions

- None for this phase; business defaults required for proposal scope were confirmed by the user.
