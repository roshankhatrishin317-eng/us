# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A romantic personal website for couples to store memories, built with Next.js 16 App Router, TypeScript, and Tailwind CSS v4. Features include timeline, gallery, interactive map, quiz, bucket list, time capsule, and a secret vault.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run ESLint
npx tsc --noEmit  # Typecheck without emit
```

Single-file operations:
```bash
npx eslint src/app/page.tsx      # Lint specific file
npx eslint src/components        # Lint specific folder
```

## Architecture

### State Management
All application state is managed through a single Zustand store (`src/lib/store.ts`) with localStorage persistence. The store contains:
- `settings`: Site configuration (couple name, dates, passwords)
- `timeline`, `gallery`, `locations`, `bucketList`, `quiz`: Content arrays
- `vault`, `capsule`: Special content sections

Each content type has CRUD actions (`add*`, `update*`, `delete*`) in the store.

### Route Structure
- `/` - Home page with hero section
- `/admin/*` - Full CMS for managing all content
- `/timeline`, `/gallery`, `/map`, `/quiz`, `/bucket-list`, `/capsule`, `/vault` - Public feature pages
- `/api/upload` - File upload endpoint (uses Vercel Blob)

### Component Patterns
- UI primitives in `src/components/ui/` follow shadcn/ui patterns with `class-variance-authority`
- Use `cn()` from `src/lib/utils` for className merging
- Map components use `react-leaflet` (dynamic import required for SSR)
- Animations use `framer-motion`

### Key Conventions
- Path alias: `@/*` → `src/*`
- "use client" only when hooks or browser APIs are needed
- Double quotes for strings, 2-space indentation
- Prefer Tailwind utility classes; use semantic tokens (`bg-primary`, `text-foreground`)

## Environment Variables

```env
BLOB_READ_WRITE_TOKEN=  # Required for image uploads (Vercel Blob)
```

## Additional Guidelines

See `AGENTS.md` for detailed coding standards, import ordering, TypeScript patterns, and accessibility requirements.
