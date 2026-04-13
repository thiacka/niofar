# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at localhost:4200
npm run build      # Production build → dist/demo/
```

No lint or test scripts are configured.

## Architecture Overview

**NIO FAR** ("We are together" in Wolof) is a bilingual (French/English) travel/tourism website for Senegal, built with Angular 21 standalone components and Supabase as the backend.

### Key Patterns

- **Standalone Angular** — no NgModules; bootstrapped via `bootstrapApplication()` in `main.ts`; all routes use `loadComponent()` for lazy loading
- **State management** — Angular Signals for reactive state; RxJS used selectively (router events only); service-level caching via Maps
- **Backend** — Supabase client initialized in `SupabaseService`; credentials in `src/environments/environment.ts`
- **Admin auth** — hardcoded password hash in `AdminService`; auth state persisted to `sessionStorage`

### Code Layout

```
src/app/
├── core/
│   ├── services/       # All data access and business logic
│   └── models/         # TypeScript interfaces
├── pages/              # Lazy-loaded page components
│   └── admin/          # Password-protected admin panel (dashboard, CRUD editors)
├── shared/
│   ├── components/     # Header, footer, edit-mode banner
│   ├── directives/     # editable-content (inline CMS), scroll-animate
│   └── pipes/          # currency-converter
├── app.routes.ts       # All route definitions
└── app.config.ts       # Providers and DI configuration
```

### Key Services

| Service | Responsibility |
|---|---|
| `SupabaseService` | Initializes the Supabase client |
| `LanguageService` | 80+ translation keys, bilingual (FR/EN) throughout the app |
| `EditModeService` | CMS inline editing — reads/writes `page_content` table, `isEditMode` signal |
| `AdminService` | Admin authentication + booking/message retrieval; `isAuthenticated` signal |
| `BookingService` | Circuit booking creation and lookup |
| `CircuitService` / `ExcursionService` | CRUD for tours and day excursions, including promotions |
| `RentalService` | Vehicle rental management |
| `CurrencyService` | Currency conversion used by `CurrencyConverterPipe` |

### Routing

All routes lazy-load with `loadComponent()`. Main public routes:

- `/` Home, `/services`, `/experiences`, `/excursions`, `/circuits`, `/circuits/:slug`
- `/rentals`, `/booking/:circuitId`, `/excursion-booking/:excursionId`
- `/confirmation/:reference`, `/booking-lookup`, `/why-nio-far`, `/contact`
- `/admin` — full admin panel subtree (password protected)
- `**` redirects to `/`

### Bilingual Content

All user-facing strings go through `LanguageService`. When adding new UI text, add translation keys for both `fr` and `en` in `language.service.ts` and use the translation function in templates.

### Deployment

Containerized with Docker + Nginx reverse proxy with Let's Encrypt SSL. See `DEPLOYMENT.md` and `docker-compose.yml` for production setup.
