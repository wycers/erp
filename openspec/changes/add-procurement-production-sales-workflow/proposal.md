# Change: Add procurement, production, and sales inventory workflow

## Why

The current project is still a starter scaffold and does not yet support the core ERP flow the user needs: purchasing materials, tracking inventory and costs, producing finished products, and calculating sales profit.

## What Changes

- Add item master data management for purchasable material SKUs (including image and notes) and sellable finished products.
- Add purchase order workflow with order number, multiple lines, decimal quantities, line-amount entry, automatic unit-price calculation, and freight allocation into landed cost.
- Add inventory ledger and costing workflow with moving weighted average cost and strict non-negative inventory enforcement.
- Add production workflow with one fixed BOM per finished product, material consumption, finished goods receipt, and production cost roll-up.
- Add sales workflow for finished products, including posting inventory outbound, COGS calculation from average cost, and profit outputs.
- Explicitly exclude returns, corrections, and reversal documents in this phase.

## Impact

- Affected specs: `item-master`, `purchase-receiving`, `inventory-costing`, `production-assembly`, `sales-profitability`
- Affected code:
  - `src/lib/server/db/schema.ts` and related migrations
  - new server-side domain modules under `src/lib/server/**`
  - new SvelteKit routes/actions for item master, purchase, inventory, production, and sales
- Data impact: new master and transactional tables for SKU, BOM, purchase, inventory ledger, production, and sales documents
