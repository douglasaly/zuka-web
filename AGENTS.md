<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `yarn add @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `yarn dlx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Zuka — Compact reference

## Dev commands

| Cmd | What |
|---|---|
| `npm run dev` | Start Next.js dev server (NODE_OPTIONS memory tweak applied) |
| `npm run lint` | Biome check (no `next lint`) |
| `npm run format` | Biome format --write |
| `npm run build` | Next.js production build |
| `npm run db:seed` | Seed base data (tsx) |
| `npm run db:seed:rbac` | Seed roles/permissions |
| `npm run db:seed:categories` | Seed categories |
| `npm run db:seed:provinces` | Seed provinces |
| `docker compose up -d` | Start local Postgres (port 5432, db zuka, user/pass docker/docker) |
| `firebase emulators:start` | Start Firebase emulators (auth:9099, firestore:8080, functions:5001) |

## Architecture

**Framework:** Next.js 16 App Router. Check `node_modules/next/dist/docs/` before writing code — this version has breaking changes from earlier Next.js.

**Auth:** Firebase Auth (client SDK) + Supabase Postgres (data). Flow: Firebase `getIdToken()` → `POST /api/auth/register` (upserts user into Supabase `users` table) → `POST /api/auth/session` (sets httpOnly cookie). Server reads cookie via `src/lib/auth/getSessionFirebaseUid()`. Protect routes with `requireSessionUser()`, `requireAdminUser()`, `requireSellerStore()` from `src/lib/auth/`.

**Database:** Supabase Postgres. Schema in `schema.sql`. Admin client at `src/lib/supabase/admin.ts` (service_role key, bypasses RLS). Browser client at `src/lib/supabase/client.ts` (anon key). No Drizzle ORM in use — raw SQL / Supabase SDK.

**Storage:** Cloudflare R2. Upload flow via presigned URLs (`POST /api/uploads/presign`). Configure CORS policy on bucket (see `.env.example`).

**UI:** shadcn/ui with custom `"base-vega"` style (see `components.json`). Tailwind CSS v4 + PostCSS. Icons: lucide-react. Path alias `@/*` → `./src/*`.

**Lint/format:** Biome only. Config at `biome.json`. No ESLint or Prettier.

**tRPC:** Being removed. Do not write new tRPC code. Use plain Next.js API routes (`src/app/api/<resource>/route.ts`) and `fetch`.

## Module pattern

Everything lives under `src/modules/<domain>/`:
```
src/modules/<domain>/
  constants.ts        # domain constants (optional)
  ui/
    layouts/          # layout components
    views/            # full-page view components
    sections/         # page sections
    components/       # reusable sub-components
```

App pages in `src/app/` are thin — they import and render a module's view/layout. No barrel files; imports are direct paths.

## Notifications (in progress)

Notifications are being built following the project module pattern. Architecture:

- **Module:** `src/modules/notifications/` — create with standard `ui/{views,components}/` structure
- **Header entrypoint:** Bell icon in `src/modules/home/ui/components/home-navbar/index.tsx` (currently dead, line ~120-127). Should open a dropdown showing recent notifications.
- **"Ver mais" button** in dropdown → navigates to `/notificacoes` (a new route under `src/app/notificacoes/page.tsx` that renders the full notifications view)
- **API:** Add `src/app/api/notifications/route.ts` (GET list for current user, POST to mark read). Follow existing API route patterns.
- **DB:** No notifications table exists yet. Create via SQL migration (Supabase). Reference `schema.sql` for conventions (uuid PKs, camelCase columns, timestamps with timezone, soft delete via `deleted_at`).
- **Admin:** Existing admin panel has notification compose UI at `src/app/admin/notifications/page.tsx` + `src/app/api/admin/notifications/route.ts` (currently stub — returns `{ notifications: [] }`). The admin sends; user receives.

## API route patterns

`src/app/api/<resource>/route.ts` exporting named HTTP functions:
```ts
export async function GET(request: NextRequest) { ... }
export async function POST(request: NextRequest) { ... }
```
Dynamic params: `src/app/api/<resource>/[id]/route.ts`, read via `params: { id: string }`.
Shared types in optional `types.ts` beside `route.ts`.

## Firebase Functions

`functions/src/index.ts` — auth triggers (onUserCreated) and future event processing.
Build: `cd functions && npm run build`.
Deploy: `firebase deploy --only functions`.

## DB seed order

1. `db:seed:provinces` (standalone table)
2. `db:seed:categories` (standalone table)
3. `db:seed:rbac` (roles/permissions)
4. `db:seed` (base data — uses Supabase service_role)

## Other conventions

- Portuguese locale (Mozambique marketplace). UI text, slugs, and URLs in Portuguese.
- Soft delete: tables use `deleted_at` timestamps; filter with `IS NULL` in queries.
- UUID v7 for primary keys (`uuidv7()` from the `uuidv7` package).
- Prefer `render={<Link href=.../>}` prop pattern on shadcn Button for navigation links (avoids nested `<a>` tags).
- Use `Suspense` for async children (see `SearchInput` in navbar).
