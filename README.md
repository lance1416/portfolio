# Portfolio — Sinan Li

Personal portfolio site. A single-page React app covering experience, projects,
and research, with a command palette, a "terminal mode" that renders the
underlying data as JSON, light/dark theming, and editorial typography.

Live at **[lance1416.com](https://www.lance1416.com)**.

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (configured entirely in `src/index.css` via `@theme`)
- **Motion** (`motion/react`, formerly Framer Motion) for transitions and micro-interactions
- **React Router** for routing
- **Biome** for linting/formatting, **Husky** + **commitlint** for git hooks

## Getting started

```bash
pnpm install
pnpm dev        # start the dev server
pnpm build      # type-check (tsc -b) and build for production
pnpm preview    # preview the production build
```

## Scripts

| Script         | Description                                 |
| -------------- | ------------------------------------------- |
| `pnpm dev`     | Start the Vite dev server with HMR          |
| `pnpm build`   | Type-check and produce a production build    |
| `pnpm preview` | Serve the production build locally           |
| `pnpm lint`    | Lint with Biome                             |
| `pnpm format`  | Format with Biome                          |
| `pnpm check`   | Lint, format, and organize imports (write)  |

## Project structure

```
src/
  components/   Reusable UI (Navbar, CommandPalette, FloatingDock, cards…)
  context/      React contexts (Theme, Terminal mode, Command palette)
  data/         Content as typed data (profile, home, nav, experience, projects, research)
  hooks/        Custom hooks (useBalancedText, useScrollLock)
  layouts/      MainLayout — shared chrome around routed pages
  pages/        Route-level views (Home, Experience, Projects, Research…)
  utils/        Helpers (cn, motion variants)
  index.css     Tailwind v4 theme + base/utility layers
```

Editing content (jobs, projects, education, awards) means editing the typed
arrays under `src/data/` — no component changes required.

## Conventions

- Imports use the `@/` alias for anything outside the current directory.
- Theme is owned by `ThemeProvider`; read/toggle it via `useTheme()` rather than
  touching the `dark` class directly.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
  (enforced by commitlint).
