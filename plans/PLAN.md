# Settings CRUD Implementation Plan

This document outlines the plan to add Create, Read, and Update (CRUD) functionality for user settings (Profile, Security, Notifications) using Supabase, Astro API routes, and React components with TanStack Query.

## Phase 1: Backend Setup (API & Database)

1.  **Verify Supabase Schema & Setup:**
    *   Confirm that Supabase tables corresponding to the schemas in `src/lib/database/schemas/settings/` (profile, security, notifications) exist or create them.
    *   Ensure tables are linked to `auth.users` (e.g., via a `user_id` column which is unique and references `auth.users.id`).
    *   Implement Row Level Security (RLS) policies on these tables to ensure users can only access/modify their own settings. Policies should check `auth.uid() = user_id`.

2.  **Create Settings API Endpoint (`src/pages/api/settings.ts`):**
    *   Create a new file `src/pages/api/settings.ts`.
    *   **GET Handler:**
        *   Implement an `async GET({ locals })` function.
        *   Check for authenticated user: `const { session, supabase } = locals; if (!session) { return new Response("Unauthorized", { status: 401 }); }`.
        *   Fetch settings data (profile, security, notifications) from the respective Supabase tables for `session.user.id`. Use `supabase.from('table_name').select('*').eq('user_id', session.user.id).single()`. Handle potential errors (e.g., user has no settings entry yet).
        *   Combine fetched data into a `UserSettings` object (defined in `src/types/settings.ts`).
        *   Return a successful `SettingsResponse` with the data: `return new Response(JSON.stringify({ success: true, data: userSettings }), { status: 200, headers: { 'Content-Type': 'application/json' } });`. Handle errors by returning `{ success: false, error: '...' }`.
    *   **PUT Handler:**
        *   Implement an `async PUT({ request, locals })` function.
        *   Check for authenticated user similarly to GET.
        *   Parse the request body: `const updateData: SettingsUpdateData = await request.json();`.
        *   Validate the incoming `updateData` (consider using Zod schemas if available/appropriate).
        *   For each section present in `updateData` (profile, security, notifications):
            *   Use Supabase `upsert` or `update` to save the data to the corresponding table, ensuring the `user_id` matches `session.user.id`. Example: `supabase.from('profiles').upsert({ user_id: session.user.id, ...updateData.profile })`.
            *   Collect results and handle potential errors from Supabase operations.
        *   Return a `SettingsResponse` indicating success or failure: `return new Response(JSON.stringify({ success: true }), { status: 200 });` or `{ success: false, error: '...' }`.

## Phase 2: Frontend Integration (UI & Data Fetching)

1.  **Fetch Initial Data on Server (`src/pages/settings.astro`):**
    *   In the frontmatter, use `Astro.locals.supabase` and `Astro.locals.session` to get the user ID.
    *   Fetch the initial `UserSettings` data directly from Supabase using the server client, similar to the GET API handler logic. Handle cases where data might be null (new user).
    *   Pass the fetched `userSettings` data as a prop to the main client-side React component rendered on the page (likely `<SettingsTabs>`). Remember to `JSON.stringify` if passing complex objects directly.

2.  **Set up TanStack Query:**
    *   Verify `@tanstack/react-query` is installed (`npm install @tanstack/react-query`).
    *   Ensure `QueryClientProvider` wraps the application or relevant layout. Check `src/components/providers.tsx` or the main layout file (`src/layouts/Layout.astro` or similar).

3.  **Refactor/Update Form Hook (`src/components/settings/useSettingsForm.ts` - if used, or implement logic in components):**
    *   **Data Fetching:**
        *   Use `useQuery` to manage settings data.
        *   Define a query key (e.g., `['userSettings']`).
        *   The query function could potentially just return the initial data passed as props from the Astro page, simplifying client-side fetching on initial load. Alternatively, it *could* call the GET API, but passing from server is often more efficient.
        *   Use the `initialData` option of `useQuery` with the data passed from `settings.astro`.
    *   **Data Mutation:**
        *   Use `useMutation` for handling updates.
        *   The mutation function (`mutationFn`) will accept `SettingsUpdateData` and make a `PUT` request to `/api/settings` using `fetch`.
        *   Configure `onSuccess`: Invalidate the `['userSettings']` query using `queryClient.invalidateQueries(['userSettings'])` to refetch fresh data. Show a success toast notification (using Shadcn `toast`).
        *   Configure `onError`: Show an error toast notification.
        *   Provide the `mutate` function and mutation state (`isLoading`, `isError`) to the components.

4.  **Update Form Components (`ProfileForm.tsx`, `SecurityForm.tsx`, `NotificationsForm.tsx`):**
    *   Receive settings data (managed by `useQuery`) and mutation functions/state (from `useMutation`) as props.
    *   Use `react-hook-form` (if not already used, as seen in `useSettingsForm.ts` usage often implies it) and connect it with Shadcn `Form` components.
    *   Populate form fields using `useForm`'s `defaultValues` or `reset` method, fed by the data from `useQuery`.
    *   Modify the `onSubmit` handler:
        *   It should gather the form data.
        *   Call the `mutate` function provided by `useMutation` with the `SettingsUpdateData`.
    *   Disable the submit button and potentially show loading indicators while `mutation.isLoading` is true.
    *   Ensure all form inputs use appropriate Shadcn UI components (`Input`, `Checkbox`, `Switch`, `Select`, etc.).

5.  **UI Feedback:**
    *   Ensure the Shadcn `Toaster` component is added to the layout/providers to display toast notifications.
    *   Add loading states (e.g., skeleton loaders or spinners) if initial data fetching takes time (less critical if passing from server).

## Phase 3: Testing & Refinement

1.  **Manual Testing:**
    *   Verify initial data loading for users with and without existing settings data.
    *   Test updating each form section individually. Save changes, refresh the page, and confirm persistence.
    *   Test updating multiple fields across different sections in one go (if forms allow saving all at once, or test sequential saves).
    *   Test error scenarios: invalid input (if client-side validation exists), API errors (simulate network failure or server error), unauthorized access attempts.
    *   Check RLS by trying to access/modify data through API calls or Supabase client with different user credentials (if possible in dev environment).
2.  **Code Review:**
    *   Ensure code adheres to project rules (`astro-react-rules.mdc`).
    *   Check for proper TypeScript usage and type safety.
    *   Verify efficient data fetching (server-side pass-through + client-side invalidation).
    *   Ensure consistent use of Shadcn UI and Tailwind CSS.
    *   Confirm proper error handling and user feedback.

This plan provides a structured approach. We can adjust details as we proceed with the implementation. 