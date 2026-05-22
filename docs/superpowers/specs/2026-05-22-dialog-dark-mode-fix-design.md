# Dialog Dark Mode Fix

**Date:** 2026-05-22
**Scope:** `src/ui/dialog.tsx` — replace hardcoded neutral colors with design system tokens

## Problem

`DialogPanel` and `DialogDescription` use hardcoded Tailwind neutral colors that ignore the `[data-theme="dark"]` CSS variable overrides defined in `style.css`. The rest of the UI uses `app-*` tokens correctly.

## Changes

### `DialogPanel`

| Class | Replace with |
|---|---|
| `bg-white` | `bg-app-surface` |
| `border-neutral-200` | `border-app-border` |

### `DialogDescription`

| Class | Replace with |
|---|---|
| `text-neutral-500` | `text-app-muted` |

### `DialogTitle`

No change needed — `text-lg font-semibold` inherits `color` from `body`, which already uses `var(--color-app-foreground)`.

## Design System Tokens (dark values)

```css
[data-theme="dark"] {
  --color-app-surface: #1e293b;   /* panel background */
  --color-app-border:  #334155;   /* panel border */
  --color-app-muted:   #94a3b8;   /* description text */
}
```

## Out of Scope

- No changes to dialog animations, layout, or other components.
- No changes to the edit dialog content (product name vs ID).
