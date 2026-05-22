# SPA Blueprint

A production-ready React SPA template with a strict layered architecture, type-safe routing, server state management, and mock-first development workflow.

## Tech Stack

| Category | Library |
|---|---|
| UI | React 19, Tailwind CSS v4, Base UI v1 (headless) |
| Routing | TanStack Router v1 (file-based) |
| Server state | TanStack Query v5 |
| Forms | TanStack Form v0.40 + Valibot v1 |
| Tables | TanStack Table v8 |
| Global state | Zustand v5 |
| Animation | Motion v11 |
| Mocking | MSW v2 |
| Testing | Vitest 2, Testing Library |
| Build | Vite 6, TypeScript 5.6 |
| Package manager | pnpm |

## Getting Started

```bash
pnpm install
pnpm dev        # starts dev server with MSW mock mode enabled
```

Open [http://localhost:5173](http://localhost:5173).

## Commands

```bash
pnpm dev              # Vite dev server (MSW mock mode on by default)
pnpm build            # tsc -b then Vite production bundle → dist/
pnpm preview          # serve production build locally
pnpm lint             # ESLint (enforces architectural boundaries)
pnpm lint:oxlint      # Oxlint fast linter
pnpm test             # unit → browser → integration (all suites)
pnpm test:unit        # unit tests only
pnpm test:browser     # browser tests only
pnpm test:integration # integration tests only
```

## Architecture

The codebase follows a strict **layered feature-based architecture** enforced by `eslint-plugin-boundaries`. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full spec.

### Layers (low → high)

| Layer | Path | Purpose |
|---|---|---|
| Core | `src/core/` | HTTP client, API routes, query keys/options, global stores, auth, utils. No UI. |
| UI | `src/ui/` | Design system primitives. No domain logic. |
| Pattern | `src/pattern/` | Composed mid-level components (forms, data grid, error boundaries). No feature-specific logic. |
| Layouts | `src/layouts/` | Structural shells (`AuthLayout`, `MainLayout`, `OnboardingLayout`). |
| Features | `src/features/` | Self-contained feature modules — components, hooks, schemas grouped together. |
| Routes | `src/routes/` | Thin route layer: guards, prefetch, layout composition, feature wiring. |
| Mocks | `src/mocks/` | MSW handlers and test setup. |

Upper layers may import lower ones — never the other way around.

### Path Aliases

```
@/*         → src/*
@core/*     → src/core/*
@ui/*       → src/ui/*
@pattern/*  → src/pattern/*
@features/* → src/features/*
@layouts/*  → src/layouts/*
@routes/*   → src/routes/*
@mocks/*    → src/mocks/*
```

### State Management

| State type | Solution |
|---|---|
| Server state | TanStack Query (keys in `core/keys.ts`, options in `core/queries.ts`) |
| Global client state | Zustand (`appStore`, `sessionStore`) |
| Local UI state | `useState` / `useReducer` |
| Compound components | React Context |
| URL state | TanStack Router search params |

Avoid `useEffect` for data fetching, mutations, or derived state.

## Key Conventions

- **No barrel exports** — import directly from the source file, never from an `index.ts` re-export.
- **Path aliases** over relative imports across layers.
- Prefer `type` over `interface`; prefer pure functions over classes.
- Avoid type casts — fix types at the source.
- Form validation is schema-driven with Valibot; schemas live alongside their feature.
- Routes stay thin; business logic belongs in `features/` or `core/`.

## Mock Mode

In development, MSW intercepts API calls by default. To disable it:

```bash
VITE_USE_MOCK=false pnpm dev
```

Mock handlers live in `src/mocks/handlers.ts`.

## Testing

Test files live at `src/**/__specs__/**/*.spec.ts[x]`. Three suites:

- **unit** — pure logic, no DOM
- **browser** — component tests with jsdom
- **integration** — full route + query flow tests
