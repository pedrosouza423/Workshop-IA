# Dialog Dark Mode Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded neutral colors in `DialogPanel` and `DialogDescription` with design system tokens so the dialog renders correctly in dark mode.

**Architecture:** Single-file change in `src/ui/dialog.tsx`. Swap three Tailwind classes for their `app-*` token equivalents, which are overridden by `[data-theme="dark"]` in `src/style.css`.

**Tech Stack:** Tailwind CSS v4, CSS custom properties (`--color-app-*`), Base UI v1.

---

### Task 1: Fix dialog dark mode colors

**Files:**
- Modify: `src/ui/dialog.tsx`

- [ ] **Step 1: Open the file and locate the two components to change**

In `src/ui/dialog.tsx`:

- `DialogPanel` (line ~39): contains `border-neutral-200 bg-white`
- `DialogDescription` (line ~55): contains `text-neutral-500`

- [ ] **Step 2: Apply the three class substitutions**

Replace the `DialogPanel` className string — change `border-neutral-200 bg-white` to `border-app-border bg-app-surface`:

```tsx
export function DialogPanel({
  className,
  ...props
}: ComponentProps<typeof Dialog.Popup>) {
  return (
    <Dialog.Popup
      className={cx(
        "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-app-border bg-app-surface p-6 shadow-lg duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        typeof className === "string" ? className : ""
      )}
      {...props}
    />
  );
}
```

Replace the `DialogDescription` className — change `text-neutral-500` to `text-app-muted`:

```tsx
export function DialogDescription(
  props: ComponentProps<typeof Dialog.Description>
) {
  return (
    <Dialog.Description className="text-sm text-app-muted" {...props} />
  );
}
```

- [ ] **Step 3: Run lint to confirm no regressions**

```bash
pnpm lint
```

Expected: no errors or warnings.

- [ ] **Step 4: Commit**

```bash
git add src/ui/dialog.tsx
git commit -m "fix(ui): use app tokens in DialogPanel and DialogDescription for dark mode"
```
