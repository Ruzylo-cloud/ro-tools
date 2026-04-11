/**
 * Server-to-server transactional email sender.
 *
 * Uses Resend (https://resend.com) — sends from `RESEND_FROM`
 * (default: "RO Tools <noreply@ro-control.app>"). Used for auth flows
 * that must send mail BEFORE the user has signed in, so there is no
 * user OAuth token available.
 *
 * Function name preserved (sendServiceEmail) so existing call sites
 * — routes/auth/apple/send-code — do not need to change.
 */
export async function sendServiceEmail({ to, subject, text, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[sendServiceEmail] RESEND_API_KEY env var not set');
    return { ok: false, error: 'resend_api_key_missing' };
  }

  const from = process.env.RESEND_FROM || 'RO Tools <noreply@ro-control.app>';
  const safeSubject = String(subject).replace(/[\r\n]/g, ' ').slice(0, 500);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: safeSubject,
        ...(html ? { html } : {}),
        ...(text ? { text } : {}),
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[sendServiceEmail] Resend ${res.status}: ${errText}`);
      return { ok: false, error: `resend_${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    console.error('[sendServiceEmail] Resend request failed:', err?.message || err);
    return { ok: false, error: String(err?.message || err) };
  }
}
