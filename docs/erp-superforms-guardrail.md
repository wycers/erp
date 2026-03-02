# ERP Superforms Guardrail

## Baseline rule

- ERP business forms under `src/routes/erp/**` MUST use `superValidate` with a zod schema as the primary server input path.
- New ERP form pages MUST use `superForm(...)` on the client side.
- Action responses MUST include `action` and return form payloads for validation failures.

## Code review checklist

- No new manual field parsing helpers like `getText(formData, key)` in ERP route actions.
- Form input constraints are defined in `src/lib/application/erp/schemas/**`.
- Validation failures are field-addressable in the page (`$errors.<field>` or row `*Form.errors`).
- Multi-row or multi-action forms include target action identity (`target*Id`) to avoid cross-row error pollution.

## Lightweight regression check

Run before merge:

```bash
rg -n "getText\(|request\.formData\(" src/routes/erp --glob '+page.server.ts'
```

Expected outcome: no newly introduced ad hoc parsing paths; any remaining `request.formData()` usage must be justified for action-target routing only.
