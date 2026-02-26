# Project Context

## Purpose
`erp` is currently a SvelteKit starter/scaffold for an ERP-style web application.

The current codebase is in an early setup/demo phase and primarily demonstrates:
- SvelteKit app structure
- Better Auth email/password authentication
- Drizzle ORM with PostgreSQL (Neon)
- Basic test/lint/build tooling

Near-term goal: use this scaffold as the foundation for ERP features while keeping specs (OpenSpec), auth, and database patterns consistent.

## Tech Stack
- SvelteKit 2 + Svelte 5 (TypeScript)
- Vite 7 (build/dev tooling)
- Vercel adapter (`@sveltejs/adapter-vercel`) for deployment target
- Tailwind CSS 4 with `@tailwindcss/forms` and `@tailwindcss/typography`
- Better Auth (`better-auth`) with SvelteKit integration
- Drizzle ORM + Drizzle Kit for schema/migrations
- PostgreSQL via Neon serverless driver (`@neondatabase/serverless`)
- Vitest (server + browser/component tests)
- Playwright (E2E tests, plus Vitest browser provider)
- ESLint 9 (flat config) + Prettier 3 + `svelte-check`
- pnpm lockfile/workspace metadata present (npm scripts also work)

## Project Conventions

### Code Style
- TypeScript strict mode is enabled (`strict: true` in `tsconfig.json`).
- Prettier is the source of truth for formatting:
  - tabs (`useTabs: true`)
  - single quotes
  - no trailing commas
  - `printWidth: 100`
- Prettier plugins are enabled for Svelte and Tailwind class sorting.
- ESLint uses recommended JS/TypeScript/Svelte configs plus Prettier compatibility.
- Prefer SvelteKit/Svelte 5 idioms already in use (for example `$props()` and `{@render ...}`).
- Follow SvelteKit file-based naming conventions:
  - route components: `+page.svelte`
  - server logic: `+page.server.ts`
  - layouts: `+layout.svelte`
  - hooks: `hooks.server.ts`
- Keep server-only code under `src/lib/server/**`.
- Use `$lib` imports for shared app modules and generated `./$types` in route files.
- Treat `src/lib/server/db/auth.schema.ts` as generated (via `auth:schema`) rather than hand-authored.

### Architecture Patterns
- SvelteKit full-stack architecture: UI routes in `src/routes`, server logic in route `load` functions and `actions`.
- Authentication is centralized in `src/lib/server/auth.ts` and wired into request handling via `src/hooks.server.ts`.
- Session/user state is attached to `event.locals` (`App.Locals`) and consumed in server `load` functions.
- Database access is centralized in `src/lib/server/db/index.ts` with Drizzle schema modules under `src/lib/server/db/`.
- Schema aggregation pattern: app tables live in `schema.ts`, and auth schema types/tables are re-exported there.
- Forms use SvelteKit actions with progressive enhancement (`use:enhance`) where appropriate.
- Keep browser-safe code and server-only code clearly separated (`src/lib/server/**` excluded from client tests/build use).
- Deployment/runtime assumptions currently align with Vercel + serverless Postgres (Neon).

### Testing Strategy
- Run `npm run check` for type checking and Svelte diagnostics before merging changes.
- Run `npm run lint` for formatting/lint checks (`prettier --check` + `eslint`).
- Use Vitest for unit/integration tests:
  - server tests: `src/**/*.{test,spec}.{js,ts}` (Node environment)
  - component/browser tests: `src/**/*.svelte.{test,spec}.{js,ts}` (Vitest browser + Playwright)
- Use Playwright for E2E tests in `e2e/*.test.ts`.
- `npm run test` runs unit tests and then E2E tests.
- Current tests are scaffold smoke tests; expand coverage as ERP modules are added (especially auth-protected flows and DB logic).

### Git Workflow
- No Git history/config is available in this workspace snapshot, so this section is a recommended baseline.
- Use short-lived feature branches and PRs; keep `main` deployable.
- For spec-worthy changes (new features, breaking changes, architecture changes), create and approve an OpenSpec proposal before implementation (see `openspec/AGENTS.md`).
- Prefer branch names that align with OpenSpec change IDs (verb-led kebab-case), e.g. `add-invoice-list`.
- Prefer clear, imperative commits (Conventional Commits are a good fit, e.g. `feat(auth): add sign-out action`).
- Squash merge PRs unless preserving commit history is important.

## Domain Context
- The repository name suggests an ERP application, but the current codebase is still scaffold/demo-level and does not yet implement ERP modules (inventory, orders, billing, etc.).
- The only domain model currently present is an example `task` table (`id`, `title`, `priority`).
- Authentication is email/password-based using Better Auth demo flows under `src/routes/demo/better-auth`.
- AI assistants should treat existing routes/tests as starter examples and preserve working auth/db infrastructure while introducing real ERP domain models.
- Update this section as actual ERP bounded contexts are introduced.

## Important Constraints
- Environment variables required for core functionality:
  - `DATABASE_URL` (required by Drizzle config and DB client)
  - `ORIGIN` (used by Better Auth `baseURL`)
  - `BETTER_AUTH_SECRET` (must be strong in production)
- `src/lib/server/db/index.ts` and `drizzle.config.ts` throw if `DATABASE_URL` is missing.
- Better Auth SvelteKit cookies plugin order matters (`sveltekitCookies(...)` should remain last in the plugin array).
- Auth DB schema generation is script-driven (`npm run auth:schema`) and may need to be run before auth migrations.
- The current adapter targets Vercel, so runtime/deployment changes may require adapter and platform-specific updates.
- Strict type-checking/linting is enabled; changes should pass `check`, `lint`, and relevant tests.

## External Dependencies
- Neon PostgreSQL (via `@neondatabase/serverless`) for application/auth data storage
- Better Auth runtime + CLI (`@better-auth/cli`) for authentication flows and schema generation
- Vercel platform adapter for deployment (`@sveltejs/adapter-vercel`)
- Playwright browser binaries/runtime for E2E and browser-based component tests
- Tailwind CSS plugin ecosystem (forms, typography)
- No external business APIs are integrated yet in the current scaffold
