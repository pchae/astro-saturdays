# Profile Form Update Plan (PROFILE_FORM_UPDATE_PLAN.md)

This plan outlines the steps to update `ProfileForm.tsx` and related API calls to ensure alignment with the Supabase database schema and required query structures.

## Phase 1: Analysis and Schema Verification

**Objective:** Confirm the exact database schema for the `profiles` table and compare it against the current frontend and backend implementations.

-   [ ] **Task 1.1: Verify Supabase `profiles` Schema:**
    *   Manually inspect the `profiles` table schema directly in Supabase UI or using SQL.
    *   **Critical Check:** Note the exact column names (e.g., `userId` vs. `user_id`, `fullName` vs. `full_name`, `website`, `bio`, etc.) and their data types.
    *   *(Limitation: Direct DB introspection via tools is currently unavailable, manual verification is required).*

-   [ ] **Task 1.2: Review Zod Schemas:**
    *   Examine `src/lib/database/schemas/settings/profile/index.ts`.
    *   Compare the fields defined (e.g., in `personalInfoSchema`, `professionalInfoSchema`) against the verified database columns from Task 1.1. Note any discrepancies in naming or structure.

-   [ ] **Task 1.3: Review `ProfileForm.tsx`:**
    *   Check the `FormField` components currently used. Which fields are being displayed and edited? (`personal.fullName`, `personal.email`, `personal.bio`, etc.)
    *   Verify the `initialData` prop type (`ProfileFormProps`) and how it's used to populate the form via `useProfileForm`.

-   [ ] **Task 1.4: Review Backend API (`updateProfile`):**
    *   Examine `src/lib/api-server/settings/index.ts` (or potentially `src/lib/api-server/user/index.ts` if profile updates are handled there).
    *   Analyze the `updateProfile` function (or equivalent).
    *   Identify how incoming `data` from the frontend is mapped to columns in the Supabase `.update()` call. Check if it uses `full_name`, `website`, `bio`, etc. matching the DB schema (Task 1.1).

## Phase 2: Frontend Updates (`ProfileForm.tsx` & Hook)

**Objective:** Align the React component and its form logic with the verified schema and desired fields.

-   [ ] **Task 2.1: Update Zod Schema (if needed):**
    *   Modify schemas in `src/lib/database/schemas/settings/profile/index.ts` to accurately reflect the fields intended for the *form*.

-   [ ] **Task 2.2: Update `ProfileForm.tsx`:**
    *   Adjust `ProfileFormProps` if the structure of `initialData` needs to change based on API fetch results.
    *   Add/Remove/Modify `FormField` components to match the desired editable fields (e.g., add `website`, ensure `fullName` maps correctly). Ensure the `name` prop (e.g., `"personal.fullName"`, `"professional.website"`) aligns with the Zod schema used by `react-hook-form`.

-   [ ] **Task 2.3: Update `useSettingsForm.ts` (or specific profile hook):**
    *   Modify the `useProfileForm` hook (or the generic `useSettingsSectionForm` it uses).
    *   Adjust `defaultValues` (like `defaultProfileData`) to match the form's Zod schema.
    *   Ensure the `onSubmit` function correctly structures the data payload (`SettingsUpdateData`) that will be sent to the API endpoint, matching what the backend expects.

## Phase 3: Backend API Updates

**Objective:** Ensure the API endpoint correctly receives frontend data and maps it to the exact Supabase database column names.

-   [ ] **Task 3.1: Modify `updateProfile` API Function:**
    *   In `src/lib/api-server/settings/index.ts` (or relevant file).
    *   Adjust the mapping logic inside the function. Ensure data received from the frontend (e.g., `data.personal?.fullName`) is explicitly assigned to the correct database column name (e.g., `full_name: data.personal?.fullName`) within the object passed to `supabase.from('profiles').update({...})`.
    *   Verify all fields being updated exist as columns in the `profiles` table with the exact names used in the `.update()` call.

-   [ ] **Task 3.2: Modify Data Fetching (if needed):**
    *   Review `fetchUserSettings` in `src/lib/api-server/settings/index.ts` and/or the direct fetch in `src/pages/settings.astro`.
    *   Ensure the `select()` statements retrieve the necessary columns.
    *   Verify the mapping from database columns (e.g., `profileResult.data.full_name`) back to the data structure expected by the frontend (`profile.personal.fullName`).

## Phase 4: Testing and Validation

**Objective:** Verify the changes work correctly end-to-end.

-   [ ] **Task 4.1: Manual Testing:**
    *   Load the `/settings` page. Verify the profile form displays existing data correctly.
    *   Modify fields in the profile form and click "Save changes".
    *   Check for success/error toasts.
    *   Refresh the page and confirm the changes persisted.
    *   Check Supabase table directly to ensure data was updated correctly.

-   [ ] **Task 4.2: Error Checking:**
    *   Monitor the browser's developer console for any frontend errors during load or save.
    *   Monitor the Astro development server's terminal output for any backend API errors.
