import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getMissionControlApiKey } from '@/lib/internal-api-key';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { theme_preference, theme_mode } = await req.json();
  const email = session.user.email;

  try {
    const profilePath = path.join(process.cwd(), 'data', 'profiles.json');
    let profiles = {};
    if (fs.existsSync(profilePath)) {
      profiles = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    }

    if (!profiles[email]) profiles[email] = {};
    
    if (theme_preference) profiles[email].theme_preference = theme_preference;
    if (theme_mode) profiles[email].theme_mode = theme_mode;

    fs.writeFileSync(profilePath, JSON.stringify(profiles, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
iKey) {
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
