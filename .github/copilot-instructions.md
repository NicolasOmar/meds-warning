# Copilot Instructions for meds-warning

## Project Overview

**meds-warning** is a Next.js 16 application with TypeScript, Zod and Tailwind CSS, using the App Router pattern that tests through unit tests with Vitest and React Testing Library.

## Architecture

- **Framework**: Next.js 16 (App Router, not Pages Router).
- **Type System**: TypeScript 5 with strict mode enabled.
- **Styling**: Tailwind CSS 4 with PostCSS.
- **UI Components**: shadcn/ui library for base components, with custom components built on top.
- **Form Handling & Validation**: Zod for schema validation.
- **Testing**: Vitest for unit and integration tests with React Testing Library.
- **Linting**: ESLint with Next.js and TypeScript rules.
- **Main Entry**: [app/layout.tsx](../app/layout.tsx) defines the root layout; [app/page.tsx](../app/page.tsx) is the homepage.
- **Components Structure**: Used components are in [components/](../components/), but subdivided into several folders:
  - [base/](../components/base/) for shadcn components.
  - [custom/](../components/custom/) for composed components (mainly based in the base ones).
  - [forms/](../components/forms/) for form-related components.
  - [tables/](../components/tables/) for table-related components.
- **Actions**: Server-side logic and API routes are in [actions/](../actions/).
- **Shared files**: Types, utilities, functions and constants are in [shared/](../shared/).
- **Path Alias**: There are several routes related to main folders (like `@actions` for `actions/`) or more specifics (like `@base-components` for `components/base/`), all configured in [tsconfig.json](../tsconfig.json) and [vitest.config.ts](../vitest.config.ts).

## Development Workflow
### Building and Running
```bash
npm start               # Start development server (http://localhost:3000)
npm run build           # Build for production
npm run start:prod      # Build and run production server
npm run lint            # Run ESLint checks
npm run prettier:check  # Run Prettier checks
npm run prettier:fix    # Run Prettier fixes
```

The dev server auto-reloads on file changes. TypeScript strict mode ensures type safety.

### Testing
- Load instructrions related to testing in [.github/instructions/testing.md](./instructions/testing.md).
- Tests are written using Vitest. To run all tests:
  ```bash
  npm test
  ```
- To run the tests with coverage report:
  ```bash
  npm run test:ci
  ```
- To run specific tests on specific components (eg. for `App`), use the test command followed by the test file paths:
  ```bash
  npm test src/components/App/index.test.tsx
  ```

## Code Patterns & Conventions

### TypeScript & React

- **React 19 with TypeScript**: Use `React.ReactNode` for children types (see [layout.tsx](../app/layout.tsx))
- **Metadata API**: Use `Metadata` type for page metadata (example in [layout.tsx](../app/layout.tsx) line 7)
- **App Router**: Routes map to filesystem structure under `app/`. There are existing examples in `app/medicine/page.tsx`

### Styling

- **Tailwind Only**: No CSS modules or styled-components. Use Tailwind utility classes exclusively
- **Dark Mode Ready**: Classes like `dark:bg-black` are already used in [page.tsx](../app/page.tsx) — maintain this pattern
- **Font Loading**: Geist font family optimized via `next/font/google` (don't use external font links)

### Testing
- **Vitest + React Testing Library**: Use `render`, `screen`, and `fireEvent` from RTL for component tests.
- **Test File Naming**: Use `.test.tsx` suffix for test files (see [app/medicine/list/page.test.tsx](../app/medicine/list/page.test.tsx)).
  - In case you are working on non-React files, use `.test.ts` suffix (see [actions/tests/medicine.test.ts](../actions/tests/medicine.test.ts)).
- **Text References**: In case of use of component texts, look first on the provided shared/constants files (like [shared/constants/forms.ts](../shared/constants/forms.ts)) to avoid hardcoding strings.
- **Mocking**: Use Vitest's built-in mocking capabilities for dependencies and implement data from a mocks.json file when needed (see [app/medicine/list/mocks.json](../app/medicine/list/mocks.json)).
- **Coverage**: Aim for high coverage; run `npm run test:ci` to check coverage reports. It should be above 85%.
- **Tests code quality**: After running tests, ensure code quality with `npm run build` and `npm run build`. In case of issues, fix them.

### Linting & Code Quality

- ESLint configured with Next.js defaults + TypeScript rules.
- Run `npm run lint` before committing; CI may enforce this.
- Config in [eslint.config.mjs](../eslint.config.mjs) extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- A good way to know the entire codebase follows best practices is to run `npm run check:project` and ensure no errors appear.

## Key Files to Reference

| File | Purpose |
|------|---------|
| [app/layout.tsx](../app/layout.tsx) | Root layout with metadata, fonts, globals |
| [app/page.tsx](../app/page.tsx) | Homepage (66 lines) — shows current UI structure |
| [app/globals.css](../app/globals.css) | Global styles (Tailwind base imports) |
| [tsconfig.json](../tsconfig.json) | Strict TypeScript config, path aliases |
| [next.config.ts](../next.config.ts) | Currently empty; add config here as needed |
| [package.json](../package.json) | Dependencies & scripts |

## Important Gotchas

1. **No Page Exports**: Don't export named components from route pages (App Router requires default exports only)
2. **"use client" for Interactivity**: If adding client-side state/hooks, add `"use client"` directive at top of file
3. **Metadata is Server-Only**: Metadata exports must be server components; use `"use client"` in separate files if interaction needed
4. **Next.js Auto-Optimization**: Images through `next/image`, fonts through `next/font` — don't bypass these
5. **Zod for Validation**: Use Zod schemas for any form or data validation (see [components/forms/MedicineForm.tsx](../components/forms/MedicineForm/index.tsx) or [shared/schemas/medicine.ts](../shared/ts/zod.ts))
6. **For more details, refer to the [README.md](../README.md) file in the project root.**
