# UI Component Guidelines

This document defines the baseline for UI component usage across the ERP application. All user-facing pages should follow these patterns to maintain visual and interaction consistency.

## Component Mapping

When implementing UI in route files, use the following shared primitives instead of raw HTML elements with ad hoc Tailwind classes:

| Raw Element | Shared Component | Import Path |
|-------------|------------------|-------------|
| `<button>` | `Button` | `$lib/components/ui/button` |
| `<input type="text">` | `Input` | `$lib/components/ui/input` |
| `<textarea>` | `Textarea` | `$lib/components/ui/textarea` |
| `<a>` (action links) | `Button` with `href` prop | `$lib/components/ui/button` |
| Container/card | `Card`, `Card.Root`, `Card.Content` | `$lib/components/ui/card` |
| Status/alert messages | `Alert` | `$lib/components/ui/alert` |
| Divider | `Separator` | `$lib/components/ui/separator` |
| Tag/label | `Badge` | `$lib/components/ui/badge` |

## Button Variants

```svelte
<script>
  import { Button } from '$lib/components/ui/button';
</script>

<!-- Primary action -->
<Button type="submit">Save</Button>

<!-- Secondary action -->
<Button variant="secondary" size="sm">Update</Button>

<!-- Outline/navigation -->
<Button variant="outline" size="sm" href="/erp/materials">Materials</Button>

<!-- Link style -->
<Button variant="link" class="h-auto p-0" href="/erp/inventory">View Details</Button>

<!-- Destructive action -->
<Button variant="destructive">Delete</Button>
```

## Alert Variants

```svelte
<script>
  import { Alert } from '$lib/components/ui/alert';
</script>

<!-- Warning message (form validation, etc.) -->
<Alert variant="warning">{form.message}</Alert>

<!-- Success message -->
<Alert variant="success">Operation completed successfully.</Alert>

<!-- Error message -->
<Alert variant="destructive">An error occurred.</Alert>

<!-- Default/informational -->
<Alert>Note: This is informational.</Alert>
```

## Card Usage

```svelte
<script>
  import * as Card from '$lib/components/ui/card';
</script>

<!-- Form container -->
<Card.Root class="gap-3 py-4">
  <Card.Content class="px-4">
    <form>...</form>
  </Card.Content>
</Card.Root>

<!-- Info box with muted background -->
<Card.Root class="bg-muted/50 gap-2 py-3">
  <Card.Content class="px-3 text-sm">
    <p class="font-medium">Title</p>
    <p class="text-muted-foreground">Description...</p>
  </Card.Content>
</Card.Root>
```

## Token Classes

When customizing components, prefer semantic token classes over hard-coded colors:

| Instead of | Use |
|------------|-----|
| `text-gray-500`, `text-gray-600` | `text-muted-foreground` |
| `text-gray-900` | (default foreground, no class needed) |
| `border-gray-200`, `border-gray-100` | `border-border`, `border-border/50` |
| `bg-gray-50` | `bg-muted/50` |

## Scope

This guideline applies to:
- `src/routes/+page.svelte` (landing page)
- `src/routes/erp/**/*.svelte` (all ERP routes)

Other areas (e.g., `src/routes/(app)/**`, demo pages) may follow different patterns until migrated.

## Regression Prevention

Run the UI compliance check script before committing changes to ERP routes:

```bash
./scripts/check-ui-compliance.sh
```

This script detects common patterns that should use shared components instead of ad hoc styling.
