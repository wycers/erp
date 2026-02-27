## 1. Implementation

- [x] 1.1 Design and migrate the domain schema for material SKUs, finished products, fixed BOM definitions, purchase orders, production orders, sales shipments, and inventory ledger entries (blocks all downstream tasks).
- [x] 1.2 Implement item master CRUD for materials (image + notes) and finished products with single fixed BOM ownership rules (depends on 1.1).
- [x] 1.3 Implement purchase order draft and posting flows with order number, line amount + quantity input, automatic unit price calculation, and freight allocation by line amount proportion (depends on 1.1, 1.2).
- [x] 1.4 Implement inventory ledger and SKU detail views with document traceability, on-hand quantity, moving weighted average cost updates, and non-negative inventory guards (depends on 1.1; can proceed in parallel with 1.3 once interfaces are aligned).
- [x] 1.5 Implement production posting flow that consumes materials from fixed BOM and receives finished goods with rolled-up unit cost (depends on 1.2, 1.4).
- [x] 1.6 Implement sales shipment posting flow for finished products with revenue, COGS, gross profit, and gross margin outputs (depends on 1.4, 1.5).
- [x] 1.7 Add automated tests for freight allocation, weighted average costing, inventory underflow rejection, and purchase -> production -> sales workflow integrity (depends on 1.3-1.6).
- [x] 1.8 Run validation gates (`npm run check`, `npm run lint`, and targeted tests) and document any known limitations for this phase.

Known limitation for this phase:

- `npm run lint` currently fails on repository-wide pre-existing formatting drift outside this change scope; however `npm run check` and targeted unit tests for the new ERP costing logic pass.
