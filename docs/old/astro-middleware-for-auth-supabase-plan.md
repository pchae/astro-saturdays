# Plan: Implement Astro Middleware for Auth & Supabase Client

**Goal:** Centralize Supabase server client creation and authentication checks using Astro middleware to reduce duplication and improve maintainability.

**Assumptions:**
*   Astro middleware (`src/middleware.ts`) is the appropriate place for request-scoped setup like Supabase client initialization and initial auth checks. (Validated via Astro docs).
*   `context.locals` is the standard mechanism for passing request-specific data (like the Supabase client or user session) from middleware to subsequent Astro pages or API endpoints. (Validated via Astro docs).
*   Using `createServerClient` from `@supabase/ssr` within middleware is the recommended approach for handling server-side Supabase interactions involving cookies. (Validated via Supabase SSR docs).

---

## Phase 1: Middleware Setup

*   [ ] **Task 1.1:** Create/Modify `src/middleware.ts`. Ensure it uses `defineMiddleware` and the basic structure.
*   [ ] **Task 1.2:** Import `createServerClient` and necessary types (`CookieOptions`, `AstroGlobal`) into `src/middleware.ts`.
*   [ ] **Task 1.3:** Inside the middleware function, initialize the Supabase server client using `createServerClient` and `context.cookies`.
*   [ ] **Task 1.4:** Attach the initialized Supabase client to `context.locals.supabase`.
*   [ ] **Task 1.5:** Update `src/env.d.ts` to declare the type of `context.locals.supabase`.

## Phase 2: Refactor API Routes

*   [ ] **Task 2.1:** Refactor `src/pages/api/auth/signin.ts` to remove its local `createServerClient` call and use `context.locals.supabase` instead.
*   [ ] **Task 2.2:** Refactor `src/pages/api/auth/register.ts` to remove its local `createServerClient` call and use `context.locals.supabase` instead.

## Phase 3: Refactor Sign-in Page (SSR Part)

*   [ ] **Task 3.1:** Refactor the frontmatter (`---` block) of `src/pages/signin.astro` to remove its local `createServerClient` call.
*   [ ] **Task 3.2:** Update the user check in `src/pages/signin.astro` frontmatter to use `context.locals.supabase.auth.getUser()` (or potentially `context.locals.user` if implemented in middleware - *decision point*).

## Phase 4: (Optional but Recommended) Centralize Auth Check in Middleware

*   [ ] **Task 4.1:** In `src/middleware.ts`, perform the `await locals.supabase.auth.getUser()` call.
*   [ ] **Task 4.2:** Attach the `user` and potentially `session` to `context.locals` (e.g., `locals.user`, `locals.session`).
*   [ ] **Task 4.3:** Update `src/env.d.ts` to declare the types for `locals.user` and `locals.session`.
*   [ ] **Task 4.4:** Update the check in `src/pages/signin.astro` frontmatter to directly use `context.locals.user` for the redirect logic.
*   [ ] **Task 4.5:** Add logic to middleware to handle redirects for protected routes based on `locals.user` presence (or roles, if applicable).

--- 