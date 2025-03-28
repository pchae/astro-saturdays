# Plan: Implement Generic Settings Form Hook

**Goal:** Replace the repetitive logic in `useProfileForm`, `useSecurityForm`, and `useNotificationForm` with a single, reusable hook `useSettingsSectionForm` located in `src/components/settings/useSettingsForm.ts`.

**Core Idea:** The generic hook will encapsulate the common `react-hook-form` setup and submission logic. It will be parameterized by the specific Zod schema, default values, initial data, and the API update function relevant to a particular settings section.

---

**Implementation Plan:**

**Phase 1: Define the Generic Hook (`useSettingsSectionForm`)**

1.  **File Location:** `src/components/settings/useSettingsForm.ts`
2.  **Hook Signature:**
    *   Define the hook using TypeScript generics to accept any Zod schema type.
    *   Accept arguments:
        *   `schema`: The Zod schema (`z.Schema<T>`) for the specific settings section.
        *   `defaultValues`: The default data structure (`DeepPartial<T>`) matching the schema.
        *   `updateFunction`: An async function `(data: T) => Promise<{ success: boolean; error?: any }>` that takes the validated form data and performs the API update for that specific section.
        *   `initialData` (optional): Pre-fetched data (`DeepPartial<T>`) to populate the form.
    *   Return value: An object `{ form: UseFormReturn<T>, onSubmit: (e?: BaseSyntheticEvent) => Promise<void>, isLoading: boolean }`.
3.  **Implementation:** Add the `UseSettingsSectionFormArgs` interface and the `useSettingsSectionForm` function definition to the file.

**Phase 2: Prepare Specific API Update Functions**

1.  **File Location:** `src/lib/api/client/settings.ts` (or wherever client-side API calls reside).
2.  **Ensure Functions Exist:** Verify or create dedicated async functions for updating each settings section (profile, security, notifications).
3.  **Function Signature:** Each function should accept the validated data for its section and return a promise resolving to `{ success: boolean; error?: any }`. They should handle the actual `fetch` or Supabase client call.

**Phase 3: Refactor Specific Hooks**

1.  **File Location:** `src/components/settings/useSettingsForm.ts`
2.  **Modify Existing Hooks:** Update `useProfileForm`, `useSecurityForm`, and `useNotificationForm` to simply call the new `useSettingsSectionForm`. Pass the correct schema, default data, the corresponding `updateFunction` from `settingsApi`, and any `initialData`.
3.  **Cleanup:** Remove the old combined `useSettingsForm` hook if it's no longer needed.

**Phase 4: Verification and Cleanup**

1.  **Component Check:** Review the components using these hooks (`ProfileForm.tsx`, `SecurityForm.tsx`, `NotificationsForm.tsx`) to ensure they still work correctly with the refactored hooks.
2.  **Testing:** Thoroughly test each settings form (loading, validation, submission, success/error handling, form reset).
3.  **Cleanup:** Remove any redundant code, old comments, or unused imports from `useSettingsForm.ts`.

--- 