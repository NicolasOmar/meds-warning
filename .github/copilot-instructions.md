# Copilot Instructions for meds-warning

## Project Overview

**meds-warning** is a Next.js 16 application with TypeScript and Tailwind CSS, using the App Router pattern. Currently in early development (`v0.1.0`) with placeholder scaffolding from `create-next-app`.

## Architecture

- **Framework**: Next.js 16 (App Router, not Pages Router)
- **Type System**: TypeScript 5 with strict mode enabled
- **Styling**: Tailwind CSS 4 with PostCSS
- **Main Entry**: [app/layout.tsx](app/layout.tsx) defines the root layout; [app/page.tsx](app/page.tsx) is the homepage
- **Path Alias**: `@/*` resolves to root directory (configured in [tsconfig.json](tsconfig.json))

## Development Workflow

```bash
npm start        # Start development server (http://localhost:3000)
npm run build      # Build for production
npm run start:prod # Build and run production server
npm run lint       # Run ESLint checks
```

The dev server auto-reloads on file changes. TypeScript strict mode ensures type safety.

## Code Patterns & Conventions

### TypeScript & React

- **React 19 with TypeScript**: Use `React.ReactNode` for children types (see [layout.tsx](app/layout.tsx))
- **Metadata API**: Use `Metadata` type for page metadata (example in [layout.tsx](app/layout.tsx) line 7)
- **App Router**: Routes map to filesystem structure under `app/`. No nested folders yet, but add routes as `app/[feature]/page.tsx`

### Styling

- **Tailwind Only**: No CSS modules or styled-components. Use Tailwind utility classes exclusively
- **Dark Mode Ready**: Classes like `dark:bg-black` are already used in [page.tsx](app/page.tsx) — maintain this pattern
- **Font Loading**: Geist font family optimized via `next/font/google` (don't use external font links)

### Linting & Code Quality

- ESLint configured with Next.js defaults + TypeScript rules
- Run `npm run lint` before committing; CI may enforce this
- Config in [eslint.config.mjs](eslint.config.mjs) extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`

## Key Files to Reference

| File | Purpose |
|------|---------|
| [app/layout.tsx](app/layout.tsx) | Root layout with metadata, fonts, globals |
| [app/page.tsx](app/page.tsx) | Homepage (66 lines) — shows current UI structure |
| [app/globals.css](app/globals.css) | Global styles (Tailwind base imports) |
| [tsconfig.json](tsconfig.json) | Strict TypeScript config, path alias `@/*` |
| [next.config.ts](next.config.ts) | Currently empty; add config here as needed |
| [package.json](package.json) | Dependencies & scripts |

## Important Gotchas

1. **No Page Exports**: Don't export named components from route pages (App Router requires default exports only)
2. **"use client" for Interactivity**: If adding client-side state/hooks, add `"use client"` directive at top of file
3. **Metadata is Server-Only**: Metadata exports must be server components; use `"use client"` in separate files if interaction needed
4. **Next.js Auto-Optimization**: Images through `next/image`, fonts through `next/font` — don't bypass these

## Next Steps for Development

- [ ] Define core features (currently just a placeholder homepage)
- [ ] Create feature-specific directories under `app/` (e.g., `app/dashboard/`, `app/api/`)
- [ ] Add component library if needed (consider `app/components/`)
- [ ] Set up any API routes under `app/api/`
- [ ] Configure environment variables in `.env.local`
