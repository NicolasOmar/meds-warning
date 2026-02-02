# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**meds-warning** is a Next.js 16 medication expiration tracking system that helps users manage medication expiration dates and sends scheduled reminders. Built with TypeScript, Prisma, PostgreSQL, Zod validation, and Tailwind CSS using the App Router pattern.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Validation**: Zod schemas
- **Testing**: Vitest + React Testing Library
- **Email**: Mailgun integration for notifications
- **Deployment**: Vercel

## Development Commands

```bash
# Development
npm start                # Start dev server (localhost:3000)
npm run build            # Build for production (includes Prisma generate and TypeScript compile)
npm run start:prod       # Build and run production server

# Database
npm run db:compile       # Generate Prisma client
npm run db:migrate       # Run migrations in dev
npm run db:seed          # Seed database
npm run db:push:dev      # Execute SQL in dev
npm run db:push:prod     # Deploy migrations to production

# Testing
npm test                 # Run tests in watch mode
npm run test:ci          # Run tests with coverage (target: >85%)

# Code Quality
npm run lint             # ESLint check (max-warnings: 0)
npm run prettier:check   # Check formatting
npm run prettier:fix     # Auto-format code
npm run check:project    # Full validation (prettier + lint + build + test:ci)

# Components
npm run add:component    # Interactive shadcn component installer

# Updates
npm run update           # Interactive dependency updates with validation
```

## Architecture

### Folder Structure

- **`actions/`**: Server actions organized by entity (medicine, presentation, settings). All server-side data mutations happen here using Next.js Server Actions.
- **`app/`**: Next.js App Router structure. Routes map to filesystem (e.g., `medicine/list/page.tsx` → `/medicine/list`). Contains:
  - `api/cron/`: Cron job endpoints (scheduled email notifications)
  - Route pages and layouts
  - `globals.css`: Tailwind base imports
- **`components/`**:
  - `base/`: shadcn components (installed via `npm run add:component`)
  - `custom/`: Composed components built on base components
  - `forms/`: Form components using `useActionState` hook (client components)
  - `tables/`: Table components for data display
- **`prisma/`**: Database layer
  - `models/`: Split Prisma schemas (medicines.prisma, presentations.prisma, users.prisma, settings.prisma)
  - `schema.prisma`: Main schema that imports all models
  - `migrations/`: Database migration history
  - `index.ts`: Configured Prisma client with PG adapter
  - Generated client outputs to `generated/prisma/`
- **`shared/`**: Shared utilities
  - `constants/`: Labels, routes (ROUTE_URLS enum), form configs, table configs
  - `functions/`: Reusable helper functions, parsers, form utilities
  - `ts/`: TypeScript types, interfaces, Zod schemas, state types

### Path Aliases

TypeScript and Vitest are configured with the following aliases (see tsconfig.json and vitest.config.ts):

- `@actions/*` → `actions/*`
- `@base-components/*` → `components/base/ui/*`
- `@base-components-shared/*` → `components/base/shared/*`
- `@custom-components/*` → `components/custom/*`
- `@form-components/*` → `components/forms/*`
- `@table-components/*` → `components/tables/*`
- `@template-components/*` → `components/templates/*`
- `@prisma/*` → `prisma/*` (in tests: points to `prisma/index.mock.ts`)
- `@shadcn/*` → `components/base/*`
- `@shared-constants/*` → `shared/constants/*`
- `@shared-functions/*` → `shared/functions/*`
- `@shared-types/*` → `shared/ts/*`

### Key Architectural Patterns

**Server Actions Pattern**: All data mutations use Next.js Server Actions in the `actions/` directory. Forms call these actions via `useActionState` hook, returning state with success/error messages.

**Prisma Multi-File Schema**: The schema is split across multiple `.prisma` files in `prisma/models/` and combined in `schema.prisma`. Always run `npm run db:compile` after schema changes to regenerate the client.

**Route Organization**: Routes follow entity-based structure:
- `/medicine` (root), `/medicine/create`, `/medicine/list`
- `/presentation` (root), `/presentation/create`, `/presentation/list`
- `/settings` (user notification preferences)

**Scheduled Notifications**: Cron jobs (in `app/api/cron/`) check for expiring medications and send email notifications via Mailgun based on user settings.

**Dark Mode**: Implemented via `next-themes` with `dark:` Tailwind classes. Always maintain dark mode support when styling.

## Development Guidelines

### TypeScript Conventions

- Use strict mode (enabled in tsconfig.json)
- Prefer interfaces over types for object shapes
- Define Zod schemas in `shared/ts/zod.ts` for all form validation
- Route enums live in `shared/constants/routes.ts` (use `ROUTE_URLS` enum)

### React Patterns

- App Router pages must default export (no named exports)
- Client components need `"use client"` directive
- Use `useActionState` for form state management
- Font loading via `next/font` (Geist font configured in layout)

### Styling

- Tailwind only (no CSS modules, no styled-components)
- Always include dark mode variants (`dark:bg-black`, etc.)
- Component class composition uses `cn()` utility from `shared/functions`

### Database

- Prisma schema changes require `npm run db:migrate` to create and apply migrations
- Use `prisma.$transaction` for multi-operation consistency
- Connection uses `@prisma/adapter-pg` with connection string from `.env`

### Testing Standards

- Test files: `*.test.tsx` (components) or `*.test.ts` (utilities)
- Mock data in `mocks.json` files (see `app/medicine/list/mocks.json`)
- Import test strings from `shared/constants/` (avoid hardcoded text)
- After writing tests: run `npm run build` → `npm run lint` → `npm run test:ci`
- Target coverage: >85% (configured in vitest.config.ts)
- Mock Prisma in tests via `@prisma/index` alias (points to `index.mock.ts`)

### Git & Commits

- Follow [Conventional Commits](https://www.conventionalcommits.org/)
- Husky enforces commitlint rules (see commitlint.config.mjs)
- lint-staged runs on pre-commit (prettier + eslint on staged files)
- Main branch deploys to production via Vercel
- Semantic versioning via semantic-release

## Environment Variables

Required in `.env`:

```
DATABASE_URL=<PostgreSQL connection string>
```

## Common Patterns

### Adding a New Route

1. Create page in `app/<route>/page.tsx`
2. Add route to `ROUTE_URLS` enum in `shared/constants/routes.ts`
3. Add to navigation arrays (`MAIN_ROUTES_OBJS`, etc.) if needed
4. Create corresponding server action in `actions/` if data mutation is needed

### Adding a Form

1. Define Zod schema in `shared/ts/zod.ts`
2. Create server action in `actions/<entity>.ts`
3. Create form component in `components/forms/` using `useActionState`
4. Add form labels/constants to `shared/constants/forms.ts`

### Adding a Prisma Model

1. Create `<entity>.prisma` in `prisma/models/`
2. Import in `prisma/models/schema.prisma`
3. Run `npm run db:migrate` to create migration
4. Run `npm run db:compile` to regenerate client

### Adding a shadcn Component

Run `npm run add:component` and enter component name. It installs to `components/base/<component-name>/`.

## Important Notes

- **Prisma Client Location**: Generated to `generated/prisma/` (not default `node_modules/.prisma`)
- **Test Mocking**: Tests use `@prisma/index` alias which resolves to `index.mock.ts`
- **Coverage Exclusions**: `app/api/**/*` excluded from coverage
- **No Time Estimates**: Avoid phrases like "this will take X minutes" in code comments
- **Scheduled Jobs**: Cron endpoints must be called externally (Vercel Cron or similar)
