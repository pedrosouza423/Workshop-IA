# Dark Mode Theme — Design Spec

**Date:** 2026-05-22
**Status:** Approved
**Branch:** feat/dark-mode-theme

## Problem

The Settings page has a "Tema" field rendered as a plain text `<input>`, and dark mode does not work. The goal is to replace the input with a proper selection control (Light / Dark) and make the dark theme actually apply to the application.

## Approach

**Segmented control + `data-theme` CSS vars** (Option B)

- A `SegmentedControl` UI component replaces the text input for the theme field.
- Dark mode is applied by setting `data-theme="dark"` on `document.documentElement`.
- CSS custom properties (`--color-app-*`) are overridden in a `[data-theme="dark"]` block in `style.css`. No existing component needs to change.
- Theme is persisted in `app-store` (Zustand + localStorage).
- Theme applies **only on clicking "Salvar"** — no live preview.

## Architecture & Data Flow

```
app mount
  └─ MainLayout useEffect
       └─ reads theme from app-store (localStorage)
            └─ sets data-theme on <html>

user selects option → clicks Salvar
  └─ SettingsPage.handleSubmit(data)
       ├─ useAppStore().setTheme(data.theme)   ← persists to localStorage
       └─ document.documentElement             ← applies to DOM immediately
            .setAttribute('data-theme', data.theme)
```

## Files to Create / Modify

| File | Change |
|---|---|
| `src/ui/segmented-control.tsx` | New component |
| `src/core/app-store.ts` | Add `theme` field + `setTheme` action |
| `src/style.css` | Add `[data-theme="dark"]` CSS vars block |
| `src/features/settings/preferences-form.tsx` | Use `SegmentedControl` for theme field |
| `src/routes/_main.settings.tsx` | Wire `onSubmit` to persist + apply theme |
| `src/layouts/main-layout.tsx` | Add `useEffect` to apply stored theme on mount |

## Component Design

### `SegmentedControl`

```tsx
type Option<T extends string> = { value: T; label: string };

type SegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
};
```

Visual: two buttons side by side with a shared border. Selected button: `bg-app-primary` with white text. Unselected: `bg-app-surface` with `text-app-foreground`. Uses `app-*` CSS vars throughout — adapts automatically to dark mode.

### `PreferencesForm` change

Replace:
```tsx
<FormFieldWrapper form={form} name="theme" label="Tema" />
```

With:
```tsx
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
        { value: "dark",  label: "Dark"  },
      ]}
    />
  )}
/>
```

## CSS — Dark Mode Variables

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

Palette rationale: slate-900/800/700 as background progression; existing emerald/teal accents retained with lightened primaries for contrast on dark backgrounds; muted colors shifted to slate-400 for readability.

## Store Change

```ts
type AppState = {
  mockApi: boolean;
  setMockApi: (value: boolean) => void;
  theme: "light" | "dark";
  setTheme: (value: "light" | "dark") => void;
};
```

`theme` is included in `partialize` so it persists to localStorage.

## Initialization

In `MainLayout` (`src/layouts/main-layout.tsx`):

```ts
useEffect(() => {
  const theme = useAppStore.getState().theme;
  document.documentElement.setAttribute('data-theme', theme);
}, []);
```

This runs once on mount, preventing a flash of the wrong theme on page refresh.

## Atomic Commits Plan

1. `feat(core): add theme field to app-store`
2. `feat(ui): add SegmentedControl component`
3. `feat(style): add dark mode CSS vars`
4. `feat(settings): wire theme selection with SegmentedControl`
5. `feat(layouts): apply persisted theme on mount`

## Out of Scope

- System preference detection (`prefers-color-scheme`)
- Live preview before saving
- Per-route theme overrides
