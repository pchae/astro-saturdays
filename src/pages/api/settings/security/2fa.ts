import type { APIRoute } from 'astro';
import { z } from 'zod';
// Assume Supabase client is available via locals, set up by middleware
// import { supabase } from '@/lib/supabase';
// Assume Prisma client is available via locals or imported directly
// import { prisma } from '@/lib/prisma';

// Define schemas for expected request bodies based on action
const enrollSchema = z.object({
  action: z.literal('enroll'),
  factorType: z.enum(['totp']), // Currently supporting only TOTP
});

const verifySchema = z.object({
  action: z.literal('verify'),
  factorId: z.string().min(1),
  code: z.string().min(6).max(6), // TOTP codes are typically 6 digits
});

const unenrollSchema = z.object({
  action: z.literal('unenroll'),
  factorId: z.string().min(1),
});

// Union schema for initial action dispatch
const actionSchema = z.discriminatedUnion('action', [
  enrollSchema,
  verifySchema,
  unenrollSchema,
]);

export const POST: APIRoute = async ({ request, locals }) => {
  // 1. Authentication & Client Setup
  // @ts-ignore - Assuming locals.supabase is configured
  const supabase = locals.supabase;
  // @ts-ignore - Assuming locals.prisma is configured or import directly
  const prisma = locals.prisma;

  if (!supabase || !prisma) {
    console.error('Supabase client or Prisma client not found on locals.');
    return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500 });
  }

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Supabase session error:', sessionError);
    return new Response(JSON.stringify({ error: 'Failed to retrieve session' }), { status: 500 });
  }

  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  const userId = session.user.id;

  // 2. Parse Request Body
  let rawBody;
  try {
    rawBody = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  // 3. Validate Action and Dispatch
  const actionValidation = actionSchema.safeParse(rawBody);

  if (!actionValidation.success) {
    return new Response(JSON.stringify({
      error: 'Invalid action or missing data',
      details: actionValidation.error.flatten(),
    }), { status: 400 });
  }

  const body = actionValidation.data;

  // 4. Handle Actions
  try {
    switch (body.action) {
      case 'enroll': {
        // Currently hardcoding totp, could be dynamic based on input if needed
        const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
        });

        if (enrollError) {
          console.error('Supabase MFA enroll error:', enrollError);
          return new Response(JSON.stringify({ error: enrollError.message || 'Failed to start MFA enrollment' }), { status: 400 });
        }

        // IMPORTANT: Send QR code details (enrollData.totp.qr_code) back to the user
        return new Response(JSON.stringify({
          message: 'Enrollment started. Scan QR code and verify.',
          enrollmentData: enrollData, // Contains QR code, secret, etc.
        }), { status: 200 });
      }

      case 'verify': {
        const { factorId, code } = body;

        // First, create a challenge
        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
        if (challengeError) {
            console.error('Supabase MFA challenge error:', challengeError);
            return new Response(JSON.stringify({ error: challengeError.message || 'Failed to create MFA challenge' }), { status: 400 });
        }
        const challengeId = challengeData.id;

        // Then, verify the code against the challenge
        const { error: verifyError } = await supabase.auth.mfa.verify({
          factorId,
          challengeId,
          code,
        });

        if (verifyError) {
          console.error('Supabase MFA verify error:', verifyError);
          // Common error: invalid code
          return new Response(JSON.stringify({ error: verifyError.message || 'Failed to verify MFA code' }), { status: 400 });
        }

        // Verification successful, update Prisma if not already enabled
        await prisma.user.update({
          where: { id: userId },
          data: { twoFactorEnabled: true },
        });

        return new Response(JSON.stringify({ message: 'MFA factor verified and enabled successfully' }), { status: 200 });
      }

      case 'unenroll': {
        const { factorId } = body;

        const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId });

        if (unenrollError) {
          console.error('Supabase MFA unenroll error:', unenrollError);
          return new Response(JSON.stringify({ error: unenrollError.message || 'Failed to unenroll MFA factor' }), { status: 400 });
        }

        // Check remaining factors
        const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError || !factorsData) {
          console.error('Supabase MFA listFactors error after unenroll:', factorsError);
          // Proceed, but log the error. State might be slightly off if this fails.
        }

        const remainingFactors = factorsData?.totp ?? []; // Assuming only TOTP for now
        const hasEnabledFactors = remainingFactors.some(f => f.status === 'verified');

        if (!hasEnabledFactors) {
            // No verified factors left, update Prisma
             await prisma.user.update({
                where: { id: userId },
                data: { twoFactorEnabled: false },
            });
        }

        return new Response(JSON.stringify({ message: 'MFA factor unenrolled successfully' }), { status: 200 });
      }

      default:
        // Should be caught by Zod, but as a safeguard
        return new Response(JSON.stringify({ error: 'Invalid action specified' }), { status: 400 });
    }
  } catch (error) {
    console.error(`Unexpected error during MFA action (${(body as any)?.action}):`, error);
    return new Response(JSON.stringify({ error: 'An unexpected server error occurred' }), { status: 500 });
  }
};

// Default handler for other methods
export const ALL: APIRoute = ({ request }) => {
  return new Response(null, { status: 405, statusText: 'Method Not Allowed' });
};