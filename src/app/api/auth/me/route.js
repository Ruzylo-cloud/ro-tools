import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('ro_session');

  if (!session?.value) {
    return NextResponse.json({ user: null });
  }

  try {
    const data = JSON.parse(Buffer.from(session.value, 'base64').toString());
    return NextResponse.json({
      user: {
        email: data.email,
        name: data.name,
        picture: data.picture,
        id: data.id,
      }
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
