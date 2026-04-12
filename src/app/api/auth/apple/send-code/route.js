import { NextResponse } from 'next/server';
import {
  generateCode,
  storePendingCode,
  findAppleLink,
  findLinkByEmail,
} from '@/lib/apple-verifications';
import { sendServiceEmail } from '@/lib/google-send-email';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/apple/send-code
 * Body: { appleUserId, jmvalleyEmail }
 * Generates a 6-digit code, stores it hashed with 10 min TTL,
 * and emails it to the @jmvalley.com address via Gmail API
 * (service account + domain-wide delegation).
 */
export async function POST(request) {
  const { limited } = rateLimit('apple-send-code', 60000, 5, request);
  if (limited) return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const appleUserId = String(body?.appleUserId || body?.apple_user_id || '').trim();
  const jmvalleyEmail = String(body?.jmvalleyEmail || body?.jmvalley_email || '')
    .trim()
    .toLowerCase();

  if (!appleUserId || !jmvalleyEmail) {
    return NextResponse.json(
      { error: 'appleUserId and jmvalleyEmail are required' },
      { status: 400 }
    );
  }

  if (!jmvalleyEmail.endsWith('@jmvalley.com')) {
    return NextResponse.json(
      { error: 'Use your @jmvalley.com email address.' },
      { status: 400 }
    );
  }

  const existingAppleLink = findAppleLink(appleUserId);
  if (existingAppleLink && existingAppleLink.jmvalleyEmail !== jmvalleyEmail) {
    return NextResponse.json(
      { error: 'This Apple ID is already linked to another account.' },
      { status: 409 }
    );
  }

  const emailLink = findLinkByEmail(jmvalleyEmail);
  if (emailLink && emailLink.appleUserId !== appleUserId) {
    return NextResponse.json(
      { error: 'That email is already linked to another Apple ID.' },
      { status: 409 }
    );
  }

  const code = generateCode();
  try {
    await storePendingCode({ appleUserId, jmvalleyEmail, code });
  } catch (err) {
    console.error('[apple/send-code] Failed to persist code:', err);
    return NextResponse.json({ error: 'Could not start verification.' }, { status: 500 });
  }

  const subject = 'RO Tools Apple Sign-In Verification Code';
  const text = [
    `Your RO Tools Apple verification code is ${code}.`,
    '',
    'Enter this code in the app to link your Apple ID to your JM Valley account.',
    'This code expires in 10 minutes.',
    '',
    'If you did not request this code, you can ignore this email.',
  ].join('\n');

  const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: auto;">
  <h2 style="color: #134A7C;">RO Tools Apple Sign-In</h2>
  <p>Your verification code is:</p>
  <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; background: #F0F4F8; padding: 16px; text-align: center; border-radius: 8px; color: #134A7C;">
    ${code}
  </div>
  <p>Enter this code in the RO Tools app to link your Apple ID to your JM Valley account.</p>
  <p style="color: #666; font-size: 13px;">This code expires in 10 minutes. If you did not request this code, you can ignore this email.</p>
</div>
`;

  const result = await sendServiceEmail({ to: jmvalleyEmail, subject, text, html });

  if (!result.ok) {
    console.error(`[apple/send-code] Email send failed for ${jmvalleyEmail}: ${result.error}`);
    console.error(`[apple/send-code] MANUAL CODE (dev fallback): ${code}`);
    return NextResponse.json(
      { error: 'Could not send verification email. Please try again.' },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, message: 'Verification code sent.' });
}
