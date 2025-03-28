import type { APIContext } from 'astro';
import { createServiceRoleClient } from '@/lib/supabase/server';

// Define a structure for the response, can be refined later
interface AllSettingsApiResponse {
  profile: any | null;
  security: any | null;
  notifications: any | null;
}

export async function GET({ locals }: APIContext): Promise<Response> {
  // 1. Authentication Check (Crucial for API Routes)
  const session = (locals as any).session;
  if (!session?.user?.id) {
    console.error("[API /api/settings/all] Unauthorized attempt.");
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const userId = session.user.id;
  console.log(`[API /api/settings/all] Authorized request for user: ${userId}`);

  // 2. Initialize Supabase Client
  const supabase = createServiceRoleClient();

  // 3. Fetch Data (Initially just profile, add others later)
  try {
    console.log(`[API /api/settings/all] Fetching profile for user: ${userId}`);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error(`[API /api/settings/all] Error fetching profile for user ${userId}:`, profileError);
      // Don't throw immediately, try fetching others if implemented
      // For now, return error if profile fetch fails
      return new Response(JSON.stringify({ error: `Failed to fetch profile settings: ${profileError.message}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log(`[API /api/settings/all] Profile data fetched for user ${userId}:`, profileData);

    // --- Placeholder for fetching security/notification settings --- 
    const securityData = null;
    const notificationsData = null;
    // --- End Placeholder --- 

    // 4. Construct Response
    const responsePayload: AllSettingsApiResponse = {
      profile: profileData, // Pass raw data, transformation can happen client-side or here if needed
      security: securityData,
      notifications: notificationsData,
    };

    console.log(`[API /api/settings/all] Sending success response for user ${userId}`);
    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error(`[API /api/settings/all] Unexpected error for user ${userId}:`, error);
    return new Response(JSON.stringify({ error: `Internal server error: ${error.message || 'Unknown error'}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 