# Dark Mode Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the text input in the Settings "Tema" field with a SegmentedControl (Light | Dark) and make the dark theme actually apply to the application on save, persisting across page refreshes.

**Architecture:** A `SegmentedControl` UI component is wired to the existing `PreferencesForm` via `FormFieldWrapper`'s render prop. The selected theme is persisted in `app-store` (Zustand + localStorage). On save, `data-theme="dark"` is set on `document.documentElement`; on mount, `MainLayout` reads the stored value and re-applies it.

**Tech Stack:** React 19, TanStack Form v0.40, Zustand v5 (persist middleware), Tailwind CSS v4 (CSS custom properties), Vitest 2, @testing-library/react

**Spec:** `docs/superpowers/specs/2026-05-22-dark-mode-theme-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/core/app-store.ts` | Modify | Add `theme` field + `setTheme` action |
| `src/ui/segmented-control.tsx` | Create | Reusable two-option toggle UI component |
| `src/ui/__specs__/segmented-control.spec.tsx` | Create | Browser tests for SegmentedControl |
| `src/style.css` | Modify | Add `[data-theme="dark"]` CSS vars block |
| `src/features/settings/preferences-form.tsx` | Modify | Use SegmentedControl for theme field |
| `src/routes/_main.settings.tsx` | Modify | Wire `onSubmit` to persist + apply theme |
| `src/layouts/main-layout.tsx` | Modify | Apply stored theme on mount |

---

## Task 0: Create feature branch

- [ ] **Create and switch to new branch**

```bash
git checkout -b feat/dark-mode-theme
```

Expected: `Switched to a new branch 'feat/dark-mode-theme'`

---

## Task 1: Add `theme` to app-store

**Files:**
- Modify: `src/core/app-store.ts`

- [ ] **Step 1: Replace the content of `src/core/app-store.ts`**

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AppState = {
  mockApi: boolean;
  setMockApi: (value: boolean) => void;
  theme: "light" | "dark";
  setTheme: (value: "light" | "dark") => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mockApi: true,
      setMockApi: (mockApi) => set({ mockApi }),
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ mockApi: s.mockApi, theme: s.theme }),
    }
  )
);
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/core/app-store.ts
git commit -m "feat(core): add theme field to app-store"
```

---

## Task 2: Create `SegmentedControl` with tests

**Files:**
- Create: `src/ui/__specs__/segmented-control.spec.tsx`
- Create: `src/ui/segmented-control.tsx`

- [ ] **Step 1: Write the failing test at `src/ui/__specs__/segmented-control.spec.tsx`**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SegmentedControl } from "@ui/segmented-control";

const OPTIONS = [
  { value: "light" as const, label: "Light" },
  { value: "dark" as const, label: "Dark" },
];

describe("ui/SegmentedControl", () => {
  it("renders all options as buttons", () => {
    render(
      <SegmentedControl value="light" onChange={vi.fn()} options={OPTIONS} />
    );
    expect(screen.getByRole("button", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();
  });

  it("calls onChange with the clicked option value", () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl value="light" onChange={onChange} options={OPTIONS} />
    );
    fireEvent.click(screen.getByRole("button", { name: "Dark" }));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith("dark");
  });
});
```

- [ ] **Step 2: Run to verify test fails**

```bash
pnpm test:browser
```

Expected: FAIL — `Cannot find module '@ui/segmented-control'`

- [ ] **Step 3: Create `src/ui/segmented-control.tsx`**

```tsx
type Option<T extends string> = { value: T; label: string };

type SegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
};

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex rounded-lg border border-app-border overflow-hidden">
      {options.map((option, i) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={[
            "px-4 py-2 text-sm font-medium transition-colors",
            i > 0 ? "border-l border-app-border" : "",
            option.value === value
              ? "bg-app-primary text-white"
              : "bg-app-surface text-app-foreground hover:bg-app-primary-muted",
          ].join(" ")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run to verify tests pass**

```bash
pnpm test:browser
```

Expected: PASS — both tests green.

- [ ] **Step 5: Commit**

```bash
git add src/ui/segmented-control.tsx src/ui/__specs__/segmented-control.spec.tsx
git commit -m "feat(ui): add SegmentedControl component"
```

---

## Task 3: Add dark mode CSS vars

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: Append the dark mode block to `src/style.css`**

Add this after the existing `body { ... }` block:

```css
[data-theme="dark"] {
  --color-app-bg:            #0f172a;
  --color-app-surface:       #1e293b;
  --color-app-border:        #334155;
  --color-app-muted:         #94a3b8;
  --color-app-foreground:    #f1f5f9;
  --color-app-primary:       #10b981;
  --color-app-primary-hover: #059669;
  --color-app-primary-muted: #064e3b;
  --color-app-accent:        #14b8a6;
  --color-app-accent-muted:  #134e4a;
}
```

- [ ] **Step 2: Verify manually in browser**

```bash
pnpm dev
```

Open DevTools → Elements → add `data-theme="dark"` attribute to `<html>`. Confirm the background turns dark.

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "feat(style): add dark mode CSS vars"
```

---

## Task 4: Wire `SegmentedControl` in `preferences-form`

**Files:**
- Modify: `src/features/settings/preferences-form.tsx`

- [ ] **Step 1: Update `preferences-form.tsx`**

Replace the plain `<FormFieldWrapper>` for `theme` with a render prop that uses `SegmentedControl`:

```tsx
import { useForm } from "@tanstack/react-form";
import { FormFieldWrapper } from "@pattern/form";
import { Button } from "@ui/button";
import { SegmentedControl } from "@ui/segmented-control";
import { createFormSubmitHandler } from "@pattern/form.hooks";
import { preferencesSchema } from "@features/settings/schemas";
import type { PreferencesFormData } from "@features/settings/schemas";

type PreferencesFormProps = {
  defaultValues?: Partial<PreferencesFormData>;
  onSubmit: (data: PreferencesFormData) => void | Promise<void>;
};

export function PreferencesForm({ defaultValues, onSubmit }: PreferencesFormProps) {
  const form = useForm<PreferencesFormData>({
    defaultValues: {
      theme: defaultValues?.theme ?? "light",
      notifications: defaultValues?.notifications ?? false,
    },
    onSubmit: async () => {
      const handler = createFormSubmitHandler(preferencesSchema, onSubmit);
      await handler(form);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FormFieldWrapper
        form={form}
        name="theme"
        label="Tema"
        render={({ value, onChange }) => (
          <SegmentedControl
            value={(value || "light") as "light" | "dark"}
            onChange={onChange}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        )}
      />
      <form.Field name="notifications">
        {(field) => (
          <label className="flex items-center gap-2 text-app-foreground">
            <input
              type="checkbox"
              checked={!!field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="rounded border-app-border text-app-primary focus:ring-app-primary"
            />
            <span>Notificações</span>
          </label>
        )}
      </form.Field>
      <Button type="submit" variant="primary">Salvar</Button>
    </form>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Verify visually in browser**

```bash
pnpm dev
```

Navigate to `/settings`. Confirm the Tema field now shows two buttons (Light | Dark) instead of a text input.

- [ ] **Step 4: Commit**

```bash
git add src/features/settings/preferences-form.tsx
git commit -m "feat(settings): wire theme selection with SegmentedControl"
```

---

## Task 5: Apply theme on save + initialize on mount

**Files:**
- Modify: `src/routes/_main.settings.tsx`
- Modify: `src/layouts/main-layout.tsx`

- [ ] **Step 1: Update `src/routes/_main.settings.tsx`**

Wire `handleSubmit` to persist and apply the theme:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { PreferencesForm } from "@features/settings/preferences-form";
import type { PreferencesFormData } from "@features/settings/schemas";
import { useAppStore } from "@core/app-store";

export const Route = createFileRoute("/_main/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const handleSubmit = (data: PreferencesFormData) => {
    if (data.theme) {
      setTheme(data.theme);
      document.documentElement.setAttribute("data-theme", data.theme);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-app-foreground">Configurações</h1>
        <p className="text-app-muted mt-1">Preferências da aplicação.</p>
      </div>
      <div className="rounded-xl border border-app-border bg-app-surface p-6 shadow-sm">
        <PreferencesForm defaultValues={{ theme }} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update `src/layouts/main-layout.tsx`**

Add a `useEffect` to apply the stored theme on mount, preventing a flash of the wrong theme on page refresh:

```tsx
import { useEffect } from "react";
import type { ReactNode } from "react";
import { Header } from "@ui/header";
import { Link, useRouterState } from "@tanstack/react-router";
import { useAppStore } from "@core/app-store";

type MainLayoutProps = {
  children: ReactNode;
  appVersion?: string;
};

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/items", label: "Items" },
  { to: "/products", label: "Produtos" },
  { to: "/settings", label: "Configurações" },
] as const;

function NavLink({ to, label }: { to: string; label: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
  return (
    <Link
      to={to}
      className={
        isActive
          ? "text-app-primary font-medium"
          : "text-app-muted hover:text-app-foreground transition-colors"
      }
    >
      {label}
    </Link>
  );
}

export function MainLayout({ children, appVersion }: MainLayoutProps) {
  useEffect(() => {
    const theme = useAppStore.getState().theme;
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return (
    <div data-slot="main-layout" className="min-h-screen flex flex-col bg-app-bg">
      <Header className="flex items-center justify-between px-6 h-14 border-app-border bg-app-surface shadow-sm">
        <nav className="flex gap-6">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} label={label} />
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-app-muted hover:text-app-foreground">
            Entrar
          </Link>
          {appVersion ? <span className="text-xs text-app-muted">{appVersion}</span> : null}
        </div>
      </Header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: End-to-end test in browser**

```bash
pnpm dev
```

1. Go to `/settings`
2. Click "Dark" button — confirm it gets highlighted
3. Click "Salvar" — confirm the entire app background turns dark immediately
4. Refresh the page — confirm dark mode is preserved (no flash of light theme)
5. Switch back to "Light", save — confirm the app returns to light mode

- [ ] **Step 5: Run all tests**

```bash
pnpm test
```

Expected: All suites pass.

- [ ] **Step 6: Commit settings route**

```bash
git add src/routes/_main.settings.tsx
git commit -m "feat(settings): apply theme on save"
```

- [ ] **Step 7: Commit layout initialization**

```bash
git add src/layouts/main-layout.tsx
git commit -m "feat(layouts): apply stored theme on mount"
```

---

## Done

6 atomic commits on `feat/dark-mode-theme`:
1. `feat(core): add theme field to app-store`
2. `feat(ui): add SegmentedControl component`
3. `feat(style): add dark mode CSS vars`
4. `feat(settings): wire theme selection with SegmentedControl`
5. `feat(settings): apply theme on save`
6. `feat(layouts): apply stored theme on mount`
