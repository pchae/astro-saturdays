# Security Feature Implementation Plan

**Goal:** Update backend logic to handle security setting changes (Password, 2FA) and persist them using Supabase Auth and potentially direct database updates via Prisma where necessary.

**Source of Truth:** The `src/lib/schemas/schema.prisma` file is the definitive source of truth for database models, fields, and relations. When implementing database interactions, always refer to this file. Code found elsewhere (e.g., in `src/lib/`, `src/middleware/`) might contain outdated logic regarding the database schema and must be validated against `schema.prisma`.

**Resources:** Consult the official documentation for best practices, API usage, and potential solutions:
*   **Supabase:** [https://supabase.com/docs](https://supabase.com/docs)
*   **Astro:** [https://docs.astro.build/en/getting-started/](https://docs.astro.build/en/getting-started/)

**Note:** Security questions and session management from the Zod schemas (`securityQuestionsSchema`, `sessionSchema`) do not map directly to the standard Supabase `users` table fields (as defined in `schema.prisma`) and are considered out of scope for this initial plan. They may require separate handling or custom database extensions.

---

## Phase 1: Backend API/Server Action Implementation

*   **Step 1: Research Supabase Auth API**
    *   Investigate Supabase client library functions for:
        *   Updating a user's password (requires authentication). Refer to `schema.prisma` `User` model for relevant fields.
        *   Enabling/disabling Two-Factor Authentication (MFA) and managing factors. Check `User.twoFactorEnabled` in `schema.prisma`.
    *   *(Consult Supabase Docs for specific API calls and authentication flows)*
*   **Step 2: Create/Modify API Endpoints or Server Actions**
    *   Define backend functions (e.g., API routes, server actions) for:
        *   Password Change (e.g., `/api/settings/security/password`)
        *   Two-Factor Authentication Update (e.g., `/api/settings/security/2fa`)
    *   *(Consult Astro Docs for best practices on creating API routes or server actions)*
*   **Step 3: Implement Update Logic**
    *   Inside the backend functions:
        *   Authenticate the request to identify the user (based on `User.id` from `schema.prisma`).
        *   Validate the request body using Zod schemas (`passwordSchema`, `twoFactorSchema.row`).
        *   **Password Change:** Use Supabase Auth function (e.g., `supabase.auth.updateUser({ password: newPassword })`). Verify against `User` model constraints in `schema.prisma` if applicable beyond Supabase Auth.
        *   **2FA Update:** Use Supabase Auth functions for MFA enrollment/unenrollment based on `enabled` status. Update Prisma `User.twoFactorEnabled` (confirm field existence and purpose in `schema.prisma`). Note Supabase manages secrets. Handle `phone`/`recoveryEmail` updates potentially via the `Profile` model (confirm relation and fields in `schema.prisma`).
    *   *(Consult Supabase Docs for details on `updateUser`, MFA functions, and Prisma interaction patterns)*
*   **Step 4: Add Error Handling**
    *   Implement robust error handling for validation, Supabase API errors, and authentication issues. Return appropriate status codes/messages.

---

## Phase 2: Frontend Integration

*   **Step 5: Identify Frontend Components**
    *   Locate the React components responsible for the Security Settings form.
*   **Step 6: Update Form Submission**
    *   Modify form submission handlers (`onSubmit`) to:
        *   Gather form data.
        *   Call the backend API endpoints/server actions from Phase 1.
    *   *(Consult Astro/React Docs for form handling and client-side data fetching)*
*   **Step 7: Implement Frontend Feedback**
    *   Add loading states during submission.
    *   Display success messages upon successful updates.
    *   Show relevant error messages from the backend.

---

## Phase 3: Testing and Refinement

*   **Step 8: Unit/Integration Testing**
    *   Write tests for backend logic, verifying Supabase interactions and data handling against `schema.prisma` definitions.
*   **Step 9: End-to-End Testing**
    *   Manually test the full UI flow: change password, toggle 2FA, verify changes in auth status and database according to `schema.prisma`.
*   **Step 10: Refine**
    *   Adjust error messages, loading states, and UX based on testing results.