import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { generateSigningToken, createSigningRequest } from '@/lib/signing';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { limited } = rateLimit('signing-create', 60000, 10, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { documentType, documentTitle, employeeName, employeeEmail, formData, driveFolderId } = body;

  if (!documentType || !documentTitle || !employeeName || !employeeEmail) {
    return NextResponse.json(
      { error: 'documentType, documentTitle, employeeName, and employeeEmail are required' },
      { status: 400 }
    );
  }

  // Validate email is @jmvalley.com
  if (!employeeEmail.endsWith('@jmvalley.com')) {
    return NextResponse.json({ error: 'Employee email must be @jmvalley.com' }, { status: 400 });
  }

  const token = generateSigningToken();

  // Build the signing URL using the request host
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const signingUrl = `${protocol}://${host}/sign/${token}`;

  // Create the signing request
  await createSigningRequest({
    token,
    documentType,
    documentTitle,
    employeeName,
    employeeEmail,
    managerName: session.name,
    managerEmail: session.email,
    formData: formData || {},
    driveFolder: driveFolderId || null,
  });

  // Send email to employee with signing link
  const emailHtml = buildSigningEmail({
    documentTitle,
    documentType,
    employeeName,
    managerName: session.name,
    signingUrl,
  });

  try {
    const emailRes = await fetch(`${protocol}://${host}/api/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify({
        to: employeeEmail,
        subject: `Action Required: Sign "${documentTitle}"`,
        htmlBody: emailHtml,
      }),
    });

    if (!emailRes.ok) {
      console.error('Failed to send signing email:', await emailRes.text());
      // Don't fail the request — the signing link is still valid
    }
  } catch (err) {
    console.error('Email send error:', err);
  }

  return NextResponse.json({ success: true, token, signingUrl });
}

/**
 * Build JMVG-branded signing email HTML.
 */
function buildSigningEmail({ documentTitle, documentType, employeeName, managerName, signingUrl }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#134A7C;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.5px;">
                JM Valley Group
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">
                Document Signing Request
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;color:#2D2D2D;font-size:16px;line-height:1.6;">
                Hi ${employeeName},
              </p>
              <p style="margin:0 0 24px;color:#2D2D2D;font-size:16px;line-height:1.6;">
                <strong>${managerName}</strong> has sent you a document that requires your signature.
              </p>
              <!-- Document Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;border-radius:8px;margin:0 0 32px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">
                      Document
                    </p>
                    <p style="margin:0 0 12px;color:#134A7C;font-size:18px;font-weight:700;">
                      ${documentTitle}
                    </p>
                    <p style="margin:0;color:#6b7280;font-size:14px;">
                      Type: ${documentType}
                    </p>
                  </td>
                </tr>
              </table>
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 0 32px;">
                    <a href="${signingUrl}" style="display:inline-block;background:#134A7C;color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">
                      Review &amp; Sign Document
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;line-height:1.5;">
                This link will expire in 72 hours. If you have questions about this document, please contact ${managerName} directly.
              </p>
              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">
                If the button doesn't work, copy and paste this URL into your browser:<br>
                <a href="${signingUrl}" style="color:#134A7C;word-break:break-all;">${signingUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                RO Tools &mdash; JM Valley Group &bull; Powered by secure e-signature
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
