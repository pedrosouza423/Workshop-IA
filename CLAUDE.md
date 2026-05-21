# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**SPA Blueprint** — a production-ready React SPA template. Package manager: `pnpm`.

## Commands

```bash
pnpm dev              # start Vite dev server (MSW mock mode enabled by default)
pnpm build            # tsc -b then Vite production bundle → dist/
pnpm preview          # serve production build locally
pnpm lint             # ESLint (enforces architectural boundaries)
pnpm lint:oxlint      # Oxlint fast linter
pnpm test             # unit → browser → integration (all suites)
pnpm test:unit        # unit tests only
pnpm test:browser     # browser tests only
pnpm test:integration # integration tests only
```

Test files live at `src/**/__specs__/**/*.spec.ts[x]`.

## Architecture

The codebase follows a strict **layered feature-based architecture** enforced by `eslint-plugin-boundaries`. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full spec.

### Layers (low → high)

| Layer | Purpose |
|---|---|
| `core/` | HTTP client, API routes, query keys/options, global stores, auth, utils. No UI. |
| `ui/` | Design system primitives. No domain logic. |
| `pattern/` | Composed mid-level components (form infra, data grid, error boundaries). No feature-specific logic. |
| `layouts/` | Structural shells (`AuthLayout`, `MainLayout`, `OnboardingLayout`). |
| `features/` | Self-contained feature modules — components, hooks, schemas grouped together. |
| `routes/` | Thin route layer: guards, prefetch, layout composition, feature wiring. |
| `mocks/` | MSW handlers and test setup. |

### Dependency rules

Upper layers may import lower ones, but not vice versa. Key rule: `ui/` must never depend on domain; `pattern/` must never depend on a specific feature; `routes/` is the only layer that can compose across all others.

### State management

- **Server state** → TanStack Query (query keys centralized in `core/keys.ts`, options in `core/queries.ts`)
- **Global client state** → Zustand (small focused stores: `appStore`, `sessionStore`)
- **Local UI state** → `useState` / `useReducer`
- **Compound components** → React Context
- **URL state** → TanStack Router search params

Avoid `useEffect` for data fetching, mutations, or derived state.

## Key conventions

- **No barrel exports** — import directly from the source file, never from an `index.ts` re-export.
- **Path aliases over relative imports** across layers: `@core/*`, `@ui/*`, `@pattern/*`, `@features/*`, `@layouts/*`, `@routes/*`, `@mocks/*`, `@/*` → `src/*`.
- Prefer `type` over `interface`; prefer pure functions over classes.
- Avoid type casts — fix types at the source.
- Form validation is schema-driven with Valibot; schemas live alongside their feature.
- Routes stay thin; business logic belongs in `features/` or `core/`.

## Tech stack

React 19 · TanStack Router v1 (file-based, auto-generates `src/routeTree.gen.ts`) · TanStack Query v5 · TanStack Form v0.40 · TanStack Table v8 · Zustand v5 · Valibot v1 · Tailwind CSS v4 · Base UI v1 (headless) · MSW v2 · Motion v11 · Vitest 2 · Vite 6
