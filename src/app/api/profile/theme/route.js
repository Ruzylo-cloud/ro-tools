import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getMissionControlApiKey } from '@/lib/internal-api-key';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { theme_preference, theme_mode } = await req.json();
  const email = session.email;

  try {
    const profilePath = path.join(process.cwd(), 'data', 'profiles.json');
    let profiles = {};
    if (fs.existsSync(profilePath)) {
      profiles = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    }

    if (!profiles[session.id]) profiles[session.id] = {};
    
    if (theme_preference) profiles[session.id].theme_preference = theme_preference;
    if (theme_mode) profiles[session.id].theme_mode = theme_mode;

    fs.writeFileSync(profilePath, JSON.stringify(profiles, null, 2));

    // Sync to Mission Control
    try {
      const MC_URL = process.env.MC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';
      const apiKey = getMissionControlApiKey();
      if (apiKey) {
        await fetch(`${MC_URL}/api/profile/theme`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
          body: JSON.stringify({ theme_preference, theme_mode, email }),
        });
      }
    } catch (e) { console.error('MC Theme Sync failed', e); }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
