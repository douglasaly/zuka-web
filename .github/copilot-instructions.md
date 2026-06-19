# Copilot instructions — Next.js API handlers + Firebase auth / user creation functions (zuka-web)

Purpose: help AI coding agents migrate this repository from a tRPC-based backend to Next.js API route handlers and Firebase Functions, while preserving Firebase auth and user onboarding flows.

Quick pointers (do not modify):
- Existing tRPC route: `src/app/api/trpc/[trpc]/route.ts`
- Existing tRPC init: `src/trpc/init.ts`
- Existing tRPC router: `src/trpc/routers/_app.ts`
- Existing tRPC client/provider: `src/trpc/client.tsx`
- Firebase admin helper: `src/lib/firebase-admin.ts`
- Firebase client helper: `src/lib/firebase-client.ts`
- Firebase Functions entrypoint: `functions/src/index.ts`
- Functions package scripts: `functions/package.json`
- Dev commands: `npm run dev`, `yarn db:push`, `cd functions && npm run build`

Recommended migration flow:
1. Remove tRPC as the primary backend transport. Replace `src/app/api/trpc/[trpc]/route.ts` and `src/trpc/*` usage with Next.js API route handlers under `src/app/api/`.
2. Handle Firebase authentication server-side in route handlers using `firebase-admin` and `admin.auth().verifyIdToken(token)`.
3. Keep `firebase-admin` only on the server and in Firebase Functions; never bundle it into browser code.
4. Use `src/lib/firebase-admin.ts` as the shared server-side admin initialization helper, or create a new server helper if needed.
5. For new-user processing, configure `functions/src/index.ts` to run when a user is created. Prefer a Firebase auth trigger such as `onUserCreated` / `auth.user().onCreate` for user creation events, or expose an HTTP function that the app can call after registration.
6. Update frontend code to use plain fetch/REST calls to `/api/...` routes instead of `useTRPC()` and the tRPC client.
7. Only delete `src/trpc/*` after the new API routes and client calls have been fully migrated.

Implementation notes and gotchas:
- Use environment variables for Firebase credentials and project config.
- `src/lib/firebase-client.ts` is the browser-side Firebase auth helper.
- `src/lib/firebase-admin.ts` is the server-side admin helper. Keep admin initialization idempotent with `getApps()`.
- In Cloud Functions, use `firebase-functions` triggers in `functions/src/index.ts` and deploy with `firebase deploy --only functions`.
- If you need to create or sync app users, do so with idempotent logic and database constraints to avoid duplicate onboarding.

Potential migration hotspots:
- `src/components/hello-view.tsx`
- `src/hooks/use-sync-user.ts`
- `src/app/layout.tsx`
- `src/trpc/server.tsx`
- `src/trpc/client.tsx`
- `src/modules/auth/server/procedures.ts`

Notes for AI agents:
- Prefer small, incremental changes: build one Next.js API route, update one consumer, then remove tRPC artifacts.
- Document any backend route changes clearly so the frontend can follow them.
- Do not reintroduce tRPC transport with new code once the migration is underway.
