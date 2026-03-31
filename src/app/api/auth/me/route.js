import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = getSession();

  if (!data) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      email: data.email,
      name: data.name,
      picture: data.picture,
      id: data.id,
    }
  });
}
