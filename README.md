# Kotlin Website - React Router 7 SSR Migration

This is a completed task, created for the JetSites 2026 internship assignment. The project migrates a legacy website from a mixed Flask/Webpack setup to a modern React Router 7 Framework Mode with server-side rendering.

## Why React Router 7 Framework Mode?

The original project used Flask for backend rendering and a manual Webpack setup for the frontend. This created several problems:

1. **Dual runtime complexity**: Flask and Node.js both running, each handling different concerns. Flask managed templates and Python logic while Webpack bundled client-side React. This split makes it harder to reason about what happens where.

2. **Poor hydration story**: There was no clear bridge between server-rendered HTML and client-side React. The site would render on the server, then React would boot on the client without proper hydration, causing potential state mismatches.

3. **Maintenance burden**: Keeping two separate build systems in sync (Flask templating + Webpack) meant configuration lived in multiple places. Any change to the build pipeline required updates in multiple files.

React Router 7 Framework Mode solves these by consolidating everything into one opinionated system. The framework handles both server rendering and client hydration seamlessly. Vite replaces Webpack as the bundler, making builds faster and the configuration simpler.

## Architecture Changes

### Before: Flask + Webpack
- Flask server renders HTML using Jinja templates
- Webpack bundles React components separately
- Manual management of when to hydrate, where to split concerns

### After: React Router 7 Framework Mode
- Single build tool (Vite) orchestrates everything
- Express server serves pre-built assets and handles SSR via React Router
- Clear entry points: `entry.server.tsx` for server rendering, `entry.client.tsx` for hydration
- All routing defined in one place (`app/routes.ts`)

## File Structure

```
app/
  root.tsx                 # Layout wrapper - renders <html>, injects CSS/JS
  entry.server.tsx         # Server rendering handler
  entry.client.tsx         # Client hydration entry point
  routes.ts                # Route definitions
  routes/
    _index.tsx             # Homepage component
react-router.config.ts     # Framework configuration: enables SSR, sets app directory
server.mjs                 # Express server that handles all requests through React Router
vite.config.ts             # Vite bundler config with SSR settings for @rescui packages
```

## How It Works

1. **Build time**: Run `npm run build`. Vite processes TypeScript, JSX, and CSS. React Router generates two bundles: one for the server (server/index.js), one for the browser (client/* with hashed filenames).

2. **Runtime - Server side**: Express server starts. When a request comes in, React Router calls `entry.server.tsx`, which renders the component tree using `renderToPipeableStream`. This streams HTML back to the client.

3. **Runtime - Client side**: The browser receives pre-rendered HTML and loads `entry.client.tsx`. React calls `hydrateRoot()` to re-attach event listeners and state management to the existing DOM, making the page interactive.

4. **State synchronization**: Components that use `useState` or `localStorage` guard with `typeof window` checks. Server renders with safe defaults (e.g., first tab selected), then `useEffect` runs after hydration to restore client-specific state (e.g., randomly select a tab, as the original did).

## Preserving Original Behavior

The original homepage had several interactive features that needed to work identically:

- **Tab switching in Why Kotlin section**: Tabs randomly select on page load and can be clicked to switch between code examples. Implemented via `useState` with a `useEffect` that fires only after hydration to avoid server/client mismatch.

- **Sort button in Usage section**: Remembers user's sort preference in localStorage. Guarded with `typeof window` check since localStorage doesn't exist on the server.

- **Mobile card visibility in header**: Shows fewer cards on small screens. Detects screen size with `useState` and `useEffect`, defaulting to a safe layout on the server.

- **Styling**: All original CSS/SCSS files preserved, including the grid system and component styles from @rescui. No visual changes needed.

## Running Locally

**Node.js (exact for Docker):** the container image uses **Node.js 20.18.3** (`Dockerfile.frontend` → `node:20.18.3-bookworm`). For a local install without Docker, use **Node.js 20.18.3 or newer** (`package.json` → `engines`). Matching **20.18.3** is recommended so behavior matches Docker (for example with [nvm](https://github.com/nvm-sh/nvm): `nvm install 20.18.3 && nvm use 20.18.3`). Check with `node -v`.

**Yarn / Vite:** `@react-router/dev` brings in `vite-node`, which allows Vite 5, 6, or 7. Yarn may otherwise resolve **Vite 7**, which requires **Node ≥ 20.19** and breaks `yarn install` on **20.18.3**. This repo pins **Vite 5.4.21** via `package.json` → `resolutions` and a matching `devDependency`. Always commit `yarn.lock` with the project.

**ESM:** `package.json` sets `"type": "module"` so Node can load the SSR bundle (`build/server/index.js`). Legacy CommonJS configs use the **`.cjs`** extension: `webpack.config.cjs`, `postcss.config.cjs`, and `scripts/react-renderer/compile.cjs`. To run Webpack manually: `webpack --config webpack.config.cjs`.

Docker is required to run locally. From the root directory:

```
docker compose up
```

After the container builds and starts, the site will be available at http://localhost:9000.

Alternatively, without Docker:

```
yarn install
yarn build
HOST=localhost PORT=9000 node server.mjs
```

## Using @rescui Components

Part of the evaluation criteria was to maintain continued use of @rescui components. The assignment required preserving @rescui throughout the migration, which made sense because:

1. @rescui already matched the design system perfectly and was used in the original
2. The components work seamlessly with React Router's hydration model
3. No visual changes needed since the design system stayed consistent

The Vite config includes special handling for @rescui packages in SSR mode to ensure they bundle correctly for the server and that CSS imports work during the build process.

## Dependencies

Key additions:
- `react-router@^7.13.1`: Framework for SSR and routing
- `@react-router/dev` and `@react-router/serve`: Build and server utilities
- `vite@^5.4.0`: Fast bundler
- `typescript@^5.6.3`: Type checking

Removals:
- Flask and Python backend dependencies (no longer needed)
- Webpack configuration (replaced by Vite)

## Limitations and Design Decisions

1. **No client-side routing**: The project has only one page, so navigation links point to external URLs. This is by design per the requirements.

2. **No dynamic data loading**: All content is baked into the component tree. There are no API calls or data loaders for the homepage.

3. **Legacy JS still runs**: `static/js/page/common.js` still executes to set OS/browser detection classes on the HTML element, maintaining backward compatibility with the existing CSS.