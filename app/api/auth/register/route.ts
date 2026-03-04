import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { username, email, password, internetYear, bio } = await req.json();

    // Basic validation
    if (!username || !email || !password || !internetYear) {
      return NextResponse.json({ error: 'All required fields missing.' }, { status: 400 });
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: 'Username must be 3–20 characters.' }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ error: 'Username: letters, numbers, underscores only.' }, { status: 400 });
    }

    const year = Number(internetYear);
    if (isNaN(year) || year < 1990 || year > new Date().getFullYear()) {
      return NextResponse.json({ error: 'Invalid internet year.' }, { status: 400 });
    }

    // Check uniqueness
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      const field = existing.email === email ? 'Email' : 'Username';
      return NextResponse.json({ error: `${field} already taken.` }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        internetYear: year,
        bio: bio || null,
      },
    });

    const token = await signToken({ userId: user.id, username: user.username });

    const headers = new Headers();
    setAuthCookie(headers, token);

    return NextResponse.json({ ok: true }, { status: 201, headers });
  } catch (err) {
    console.error('[register]', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
