# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint (flat config)
pnpm prettier     # Check formatting
pnpm format       # Fix formatting
pnpm check-types  # TypeScript type checking
```

Requirements: Node >= 24, pnpm >= 10. No test framework is configured — type checking is the primary quality gate.

Commits must follow conventional format with types: `chore`, `ci`, `docs`, `feat`, `fix`, `refactor`, `revert`, `style`. Subject max 50 characters.

## Architecture

**Atlas** is a private travel photo gallery built with Next.js App Router (Next 16 / React 19). It displays travel photos organized by geographic location with interactive maps.

### Data Flow

The application is driven by a single data file `images/metadata.json` (gitignored; see `images/metadata.json.example`). On load:

1. `/api/places` calls `getPlacesByLocation()` which reads `metadata.json` and aggregates `TravelImage[]` into `Place[]` grouped by country/state/city.
2. The home page (`/app/page.tsx`) fetches places and manages a multi-level view state.

### View State Machine (app/page.tsx)

The home page is a single client component managing four mutually exclusive views:

- **World map** (default) — all countries, highlights visited ones
- **Iran states map** — triggered when Iran is selected; shows provinces
- **Cities map** — triggered for non-Iran countries; shows cities within that country
- **Image gallery modal** — opens over any map when a place with images is selected

Maps are dynamically imported with `{ ssr: false }` to avoid hydration issues with `react-simple-maps`.

### Key Files

| Path                                | Purpose                                           |
| ----------------------------------- | ------------------------------------------------- |
| `app/page.tsx`                      | Root client component; owns all view state        |
| `app/api/places/route.ts`           | Returns aggregated `Place[]` from metadata        |
| `app/api/images/[...path]/route.ts` | Serves image files from `images/` directory       |
| `components/WorldMap.tsx`           | Interactive world map                             |
| `components/IranMap.tsx`            | Iran provinces map                                |
| `components/CitiesMap.tsx`          | Cities map for non-Iran countries                 |
| `components/ImageGallery.tsx`       | Modal gallery with full-screen support            |
| `utils/maps/images.ts`              | Core data loading and aggregation                 |
| `utils/mapData.ts`                  | Country/province name normalization and matching  |
| `utils/textUtils.ts`                | RTL detection and font selection (Persian/Arabic) |
| `types/index.ts`                    | `TravelImage` and `Place` type definitions        |
| `public/data/countries-110m.json`   | World map GeoJSON                                 |
| `public/data/ir.json`               | Iran provinces GeoJSON                            |

### Name Matching

Geographic names in GeoJSON often differ from names in `metadata.json`. `utils/mapData.ts` contains normalization maps and `countriesMatch()` / `provincesMatch()` functions that handle these discrepancies (e.g. "USA" ↔ "United States", Persian province name variants).

### Internationalization

The app supports RTL text (Persian/Arabic). `utils/textUtils.ts` provides `isRTL()`, `getFontFamily()`, and `getTextDirection()`. The Vazirmatn font is used for RTL content, Inter for LTR — both served locally from `app/fonts/`.

## Docker

The app uses a two-stage Dockerfile with Next.js `standalone` output for a minimal production image.

**Build args** (all defaulted; the CI passes them from `release.yml` env vars):

| Arg            | Default | Purpose                              |
| -------------- | ------- | ------------------------------------ |
| `NODE_VERSION` | `24`    | Node Alpine base image               |
| `PNPM_VERSION` | `10`    | pnpm major version installed via npm |
| `VERSION`      | `dev`   | Set as OCI image version label       |

**Local build and run:**

```bash
# Or plain Docker
docker build -t atlas .
docker run -p 3000:3000 -v ./images:/app/images atlas
```

The `images/` directory must be bind-mounted at `/app/images` at runtime; it is not copied into the image.

The CI workflow (`.github/workflows/release.yml`) builds and pushes to `ghcr.io/<repo>` on every `v*` tag, with `linux/amd64` and `linux/arm64` platforms.

## Code Style

- Print width: 100, single quotes, no trailing commas, 2-space indent
- TypeScript strict mode: `noUnusedLocals`, `noUnusedParameters`, `noImplicitAny`
- ESLint enforces camelCase variables, PascalCase types, and sorted imports
- Path alias `@/*` maps to the repo root
