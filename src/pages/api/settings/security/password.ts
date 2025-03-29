import type { APIRoute } from 'astro';
import { passwordSchema } from '@/lib/database/schemas/settings/security'; // Adjust path if necessary
// Assume Supabase client is available via locals, set up by middleware
// import { supabase } from '@/lib/supabase'; // Or however you access your client

export const POST: APIRoute = async ({ request, locals }) => {
  // 1. Authentication: Get Supabase instance and check session
  // Adjust how you access supabase and session based on your middleware setup
  const supabase = locals.supabase; 
  if (!supabase) {
    return new Response(JSON.stringify({ error: 'Supabase client not found.' }), { status: 500 });
  }

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session || !session.user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  // 2. Parse Request Body
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  // 3. Validate Input
  const validationResult = passwordSchema.safeParse(body);

  if (!validationResult.success) {
    // Return validation errors
    return new Response(JSON.stringify({ 
      error: 'Invalid input', 
      details: validationResult.error.flatten().fieldErrors 
    }), { status: 400 });
  }

  const { newPassword } = validationResult.data;

  // 4. Call Supabase to update password
  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error('Supabase password update error:', updateError);
      // Provide a generic error, or map specific Supabase errors if needed
      return new Response(JSON.stringify({ error: updateError.message || 'Failed to update password' }), { status: 500 });
    }

    // 5. Success Response
    return new Response(JSON.stringify({ 
        success: true,
        message: 'Password updated successfully' 
    }), { status: 200 });

  } catch (error) {
    console.error('Unexpected error updating password:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
  }
};

// Optionally, you could add handlers for other methods (GET, PUT, DELETE) if needed,
// returning 405 Method Not Allowed by default.
export const ALL: APIRoute = ({ request }) => {
  return new Response(
    JSON.stringify({ error: `Method ${request.method} Not Allowed` }),
    { status: 405 }
  );
}