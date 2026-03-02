# ERP Superforms Migration Matrix

## Routes and action mapping

| Route             | Action        | Schema                            | UI form binding                                                   |
| ----------------- | ------------- | --------------------------------- | ----------------------------------------------------------------- |
| `/erp/products`   | `create`      | `createProductFormSchema`         | `superForm(data.createForm)` in `+page.svelte`                    |
| `/erp/products`   | `update`      | `updateProductFormSchema`         | row update form + `action/targetProductId/updateForm` mapping     |
| `/erp/products`   | `saveBom`     | `saveProductBomFormSchema`        | row BOM form + `action/targetProductId/bomForm` mapping           |
| `/erp/purchases`  | `createDraft` | `createPurchaseDraftFormSchema`   | `superForm(data.createDraftForm)` in `+page.svelte`               |
| `/erp/purchases`  | `post`        | `postPurchaseOrderFormSchema`     | row post form + `action/targetPurchaseOrderId/postForm` mapping   |
| `/erp/sales`      | `createDraft` | `createSalesDraftFormSchema`      | `superForm(data.createDraftForm)` in `+page.svelte`               |
| `/erp/sales`      | `post`        | `postSalesShipmentFormSchema`     | row post form + `action/targetSalesShipmentId/postForm` mapping   |
| `/erp/production` | `createDraft` | `createProductionDraftFormSchema` | `superForm(data.createDraftForm)` in `+page.svelte`               |
| `/erp/production` | `post`        | `postProductionOrderFormSchema`   | row post form + `action/targetProductionOrderId/postForm` mapping |

## Shared primitives

- Shared schema helpers: `src/lib/application/erp/schemas/common.ts`
- Shared action error mapping: `src/lib/server/erp/superforms-action.ts`
- Unified action payload contract: validation returns `{ form, action }`; row actions return `{ action, target*Id, *Form }` for precise feedback binding.
