import type { APIContext, APIRoute } from 'astro';
// Remove unused imports if any after modification
// import type { UserSettings, SettingsUpdateData, SettingsResponse } from '@/types/settings';
import { type ProfileSettingsSchema, profileSettingsSchema } from '@/lib/database/schemas/settings/profile/index'; // Import Zod schema
import type { ApiResponse } from '@/types/api'; // Use consistent API response type
import { createServiceRoleClient } from '@/lib/supabase/server'; // Use service role for updates

// Use the actual table names confirmed earlier
const PROFILES_TABLE = 'profiles'; // Changed from PROFILE_TABLE for consistency
// const SECURITY_SETTINGS_TABLE = 'security_settings'; // Removed
// const NOTIFICATION_SETTINGS_TABLE = 'notification_settings'; // Removed

// --- GET Handler (Using updatedAt) ---
export const GET: APIRoute = async ({ locals }): Promise<Response> => {
  console.log("GET /api/settings/profile: Request received");

  const { session } = locals;
  if (!session?.user) {
    console.warn("GET /api/settings/profile: Unauthorized - No session");
    return new Response(JSON.stringify({ success: false, error: 'Authentication required' } as ApiResponse<never>), { status: 401 });
  }
  const userId = session.user.id;
  console.log(`GET /api/settings/profile: User authenticated: ${userId}`);

  const supabaseService = createServiceRoleClient();

  try {
    console.log(`GET /api/settings/profile: Fetching profile for user ${userId}`);
    const { data, error } = await supabaseService
      .from(PROFILES_TABLE)
      .select(`
        firstName, lastName, phoneNumber,
        companyName, companyPosition, updatedAt
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error(`GET /api/settings/profile: Supabase fetch error for user ${userId}:`, error);
      // Handle specific errors like user not found (though unlikely post-auth)
      if (error.code === 'PGRST116') { // PostgREST code for "Resource Not Found"
          return new Response(JSON.stringify({ success: false, error: 'Profile not found.' } as ApiResponse<never>), { status: 404 });
      }
      return new Response(JSON.stringify({ success: false, error: 'Failed to fetch profile settings.' } as ApiResponse<never>), { status: 500 });
    }

    if (!data) {
      console.warn(`GET /api/settings/profile: No profile data found for user ${userId} after successful query.`);
      return new Response(JSON.stringify({ success: false, error: 'Profile data not found.' } as ApiResponse<never>), { status: 404 });
    }

    console.log(`GET /api/settings/profile: Profile data fetched successfully for user ${userId}`);

    // Map DB columns to the frontend schema structure
    const responseData: ProfileSettingsSchema = {
      personal: {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phoneNumber: data.phoneNumber || '',
      },
      professional: {
        companyName: data.companyName || '',
        companyPosition: data.companyPosition || '',
      },
    };

    console.log(`GET /api/settings/profile: Sending success response for user ${userId}`);
    return new Response(JSON.stringify({ success: true, data: responseData } as ApiResponse<ProfileSettingsSchema>), { status: 200 });

  } catch (err: unknown) {
    const error = err as Error;
    console.error(`GET /api/settings/profile: Unexpected error for user ${userId}:`, error);
    return new Response(JSON.stringify({ success: false, error: 'An unexpected server error occurred.' } as ApiResponse<never>), { status: 500 });
  }
};

// --- PUT Handler (Using Upsert, Added userId) ---
export async function PUT({ request, locals }: APIContext): Promise<Response> {
  console.log("PUT /api/settings/profile: Request received");

  const { session } = locals;
  if (!session?.user) {
    console.warn("PUT /api/settings/profile: Unauthorized - No session");
    return new Response(JSON.stringify({ success: false, error: 'Authentication required' } as ApiResponse<never>), { status: 401 });
  }
  const userId = session.user.id;
  console.log(`PUT /api/settings/profile: User authenticated: ${userId}`);

  let rawData;
  try {
    rawData = await request.json();
  } catch (error) {
    console.error("PUT /api/settings/profile: Failed to parse request body", error);
    return new Response(JSON.stringify({ success: false, error: 'Invalid request body' } as ApiResponse<never>), { status: 400 });
  }

  const validationResult = profileSettingsSchema.row.safeParse(rawData);
  if (!validationResult.success) {
    console.warn("PUT /api/settings/profile: Data validation failed", validationResult.error.flatten());
    return new Response(JSON.stringify({ success: false, error: 'Invalid data format', details: validationResult.error.flatten() } as ApiResponse<never>), { status: 400 });
  }
  const validatedData: ProfileSettingsSchema = validationResult.data;
  console.log("PUT /api/settings/profile: Data validated successfully");

  // 4. Prepare Data for Supabase (Adding userId field)
  const upsertPayload: { [key: string]: any } = {
    id: userId, // Primary key for conflict resolution/insertion
    userId: userId, // The separate non-nullable userId column
    // Personal Info
    ...(validatedData.personal.firstName && { firstName: validatedData.personal.firstName }),
    ...(validatedData.personal.lastName && { lastName: validatedData.personal.lastName }),
    ...(validatedData.personal.phoneNumber && { phoneNumber: validatedData.personal.phoneNumber }),

    // Professional Info
    ...(validatedData.professional.companyName && { companyName: validatedData.professional.companyName }),
    ...(validatedData.professional.companyPosition && { companyPosition: validatedData.professional.companyPosition }),

    // Timestamps
    updatedAt: new Date().toISOString(), // Use camelCase
  };

  // Remove undefined/empty properties (but KEEP id and userId)
  Object.keys(upsertPayload).forEach(key => {
    if (key !== 'id' && key !== 'userId' && (upsertPayload[key] === undefined || upsertPayload[key] === '')) {
      delete upsertPayload[key];
    }
  });

  console.log(`PUT /api/settings/profile: Preparing upsert for user ${userId} with payload:`, upsertPayload);

  // Skip DB call if only id, userId and updatedAt are present
  if (Object.keys(upsertPayload).length === 3 && upsertPayload.id && upsertPayload.userId && upsertPayload.updatedAt) {
       console.log(`PUT /api/settings/profile: No data fields to upsert for user ${userId}, only timestamp. Fetching current data.`);
       const currentData = await fetchCurrentProfileData(userId);
       if (!currentData) {
           console.warn(`PUT /api/settings/profile: No data provided to create profile for user ${userId}, and profile doesn't exist.`);
           return new Response(JSON.stringify({ success: false, error: 'Profile not found and no data provided to create it.' } as ApiResponse<never>), { status: 404 });
       }
       return new Response(JSON.stringify({ success: true, data: currentData, message: "No fields required updating." } as ApiResponse<ProfileSettingsSchema>), { status: 200 });
    }

  // 5. Database Upsert (Insert or Update)
  try {
    const supabaseService = createServiceRoleClient();
    console.log(`PUT /api/settings/profile: Attempting Supabase upsert for user ${userId}`);
    
    const { data: upsertedData, error: upsertError } = await supabaseService
      .from(PROFILES_TABLE)
      .upsert(upsertPayload, {
        onConflict: 'id', 
      })
      // Select relevant columns, including the newly added userId if needed later
      .select(`
        userId, firstName, lastName, phoneNumber,
        companyName, companyPosition, updatedAt 
      `)
      .maybeSingle(); 

    // Handle potential DB errors from the upsert itself
    if (upsertError) {
      console.error(`PUT /api/settings/profile: Supabase upsert error for user ${userId}:`, upsertError);
      let errorMessage = 'Failed to save profile settings.';
      if (upsertError.code === '23505') { 
          errorMessage = 'A value provided conflicts with an existing record.';
      }
      // Check specifically for the NOT NULL violation we just encountered
      if (upsertError.code === '23502') {
          console.error(`PUT /api/settings/profile: NOT NULL constraint violation. Payload:`, upsertPayload, `Error:`, upsertError.message);
          errorMessage = `Failed to save profile: A required field (${upsertError.message.match(/column "(.*?)"/)?.[1] || 'unknown'}) was missing.`;
      }
      return new Response(JSON.stringify({ success: false, error: errorMessage } as ApiResponse<never>), { status: 500 });
    }
    
    // Handle case where upsert succeeded but select returned null (highly unlikely)
    if (!upsertedData) {
        console.error(`PUT /api/settings/profile: Upsert processed but no profile data returned for user ${userId}. This is unexpected.`);
        return new Response(JSON.stringify({ success: false, error: 'Failed to retrieve profile data after saving.' } as ApiResponse<never>), { status: 500 });
    }

    console.log(`PUT /api/settings/profile: Profile upsert successful for user ${userId}`);

    // 6. Format Response
    const responseData: ProfileSettingsSchema = {
        personal: {
            firstName: upsertedData.firstName || '',
            lastName: upsertedData.lastName || '',
            phoneNumber: upsertedData.phoneNumber || '',
          },
          professional: {
            companyName: upsertedData.companyName || '',
            companyPosition: upsertedData.companyPosition || '',
          },
    };

    console.log(`PUT /api/settings/profile: Sending success response for user ${userId}`);
    return new Response(JSON.stringify({ success: true, data: responseData } as ApiResponse<ProfileSettingsSchema>), { status: 200 });

  } catch (err: unknown) {
    const error = err as Error;
    console.error(`PUT /api/settings/profile: Unexpected error during update for user ${userId}:`, error);
    return new Response(JSON.stringify({ success: false, error: 'An unexpected server error occurred.' } as ApiResponse<never>), { status: 500 });
  }
}

// Helper function (Using maybeSingle)
async function fetchCurrentProfileData(userId: string): Promise<ProfileSettingsSchema | null> {
    console.log(`Helper fetchCurrentProfileData: Fetching profile for user ${userId}`);
    const supabaseService = createServiceRoleClient();
    try {
        const { data, error } = await supabaseService
            .from(PROFILES_TABLE)
            .select(`
                firstName, lastName, phoneNumber,
                companyName, companyPosition, updatedAt
            `)
            .eq('id', userId)
            .maybeSingle(); // Changed from single()

        if (error) { // Check for error first
            console.error(`Helper fetchCurrentProfileData: Error fetching profile for user ${userId}:`, error);
            return null;
        }
        if (!data) { // Then check if data is null
            console.warn(`Helper fetchCurrentProfileData: No profile data found for user ${userId}`);
            return null;
        }

        // Map to the schema structure
        return {
            personal: {
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                phoneNumber: data.phoneNumber || '',
            },
            professional: {
                companyName: data.companyName || '',
                companyPosition: data.companyPosition || '',
            },
        };
    } catch (err) {
        console.error(`Helper fetchCurrentProfileData: Unexpected error for user ${userId}:`, err);
        return null;
    }
}
