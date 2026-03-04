import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Google-only users have no password — tell them to use Google Sign-In
    if (!user.password) {
      return NextResponse.json(
        { error: 'This account uses Google Sign-In. Click "Continue with Google" below.' },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = await signToken({ userId: user.id, username: user.username });

    const headers = new Headers();
    setAuthCookie(headers, token);

    return NextResponse.json({ ok: true, username: user.username }, { headers });
  } catch (err) {
    console.error('[login]', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
