# Copilot instructions — TRPC + Firebase auth (zuka-web)

Purpose: give AI coding agents concise, actionable guidance for implementing Firebase-based authentication and authorization in this repository's tRPC flow.

Quick pointers (do not modify):
- TRPC context creator: [src/trpc/init.ts](src/trpc/init.ts)
- TRPC API route: [src/app/api/trpc/[trpc]/route.ts](src/app/api/trpc/[trpc]/route.ts)
- Root router: [src/trpc/routers/_app.ts](src/trpc/routers/_app.ts)
- Client/provider: [src/trpc/client.tsx](src/trpc/client.tsx)
- Dev commands: `npm run dev`, `npm run build` (see [package.json](package.json))

Recommended TRPC + Firebase auth flow (minimal, server-side):
1. Incoming requests to TRPC APIs should include a Firebase ID token (Authorization: Bearer <token> or a secure cookie).
2. In the server-side `createTRPCContext` ([src/trpc/init.ts](src/trpc/init.ts)), verify the token using the Firebase Admin SDK (`admin.auth().verifyIdToken(token)`). Use a service account or env-based credentials (FIREBASE_* env vars).
3. After verification, map the `firebaseUid` to an application user record in your database. If no user exists, create one (persist firebaseUid, email, displayName, default roles). Return the app user id.
4. Attach the resulting user object to the TRPC context (e.g. `{ userId, firebaseUid, email, roles }`) so procedures can read `ctx.user`.
5. Enforce authorization inside procedures using `ctx.user` (e.g. `if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' })` or check `ctx.user.roles`). Prefer procedure-level checks over relying on client-side flags.
6. Keep all token verification and sensitive logic on the server (never bundle `firebase-admin` in client code).

Implementation notes and gotchas:
- Use `firebase-admin` (server) and `firebase` (client) SDKs. Add `firebase-admin` to server dependencies.
- If running in serverless environments, reuse initialized `admin` app across invocations.
- Securely provide service account credentials; avoid committing private keys. If the private key contains newlines, set it via environment variable with proper escaping.
- When creating or updating the app user record, avoid race conditions by upserting on `firebaseUid`.

Example minimal outline to add in `createTRPCContext` (pseudocode):

```ts
// server-only
const token = getBearerTokenFromHeaders(opts.headers)
if (token) {
  const decoded = await admin.auth().verifyIdToken(token)
  const user = await findOrCreateUserByFirebaseUid(decoded.uid)
  return { user }
}
return { user: null }
```

Where to implement changes:
- Update `src/trpc/init.ts` to perform verification and attach `user` to context.
- Keep `src/app/api/trpc/[trpc]/route.ts` and `src/trpc/server.tsx` unchanged except for relying on the enhanced context.

If you want, I can also:
- Create a small `auth.ts` helper that wraps `firebase-admin` initialization and token verification.
- Add an automated skill to scaffold the server-side auth integration.

Notes for AI agents:
- Link to docs rather than copying: point to Firebase Admin docs for `verifyIdToken` when needed.
- Be minimal and explicit: prefer small, reviewable PRs that touch only `src/trpc/init.ts` and a helper file.
