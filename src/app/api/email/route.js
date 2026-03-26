import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getAuthenticatedClient, getGmail } from '@/lib/google-client';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { limited } = rateLimit('email', 60000, 5, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const auth = getAuthenticatedClient();
  if (!auth) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { to, subject, htmlBody } = body;
  if (!to || !subject || !htmlBody) {
    return NextResponse.json({ error: 'to, subject, and htmlBody are required' }, { status: 400 });
  }

  // Validate recipient is @jmvalley.com for safety
  const recipients = Array.isArray(to) ? to : [to];
  for (const addr of recipients) {
    if (!addr.endsWith('@jmvalley.com')) {
      return NextResponse.json({ error: 'Can only send to @jmvalley.com addresses' }, { status: 400 });
    }
  }

  try {
    const gmail = getGmail(auth.client);
    const from = session.email;
    const toStr = recipients.join(', ');

    // Build RFC 2822 message
    const messageParts = [
      `From: ${session.name} <${from}>`,
      `To: ${toStr}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      htmlBody,
    ];
    const raw = Buffer.from(messageParts.join('\r\n'))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
