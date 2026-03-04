import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { internetYear, bio } = body;

  const currentYear = new Date().getFullYear();
  if (internetYear !== undefined) {
    const year = Number(internetYear);
    if (!Number.isInteger(year) || year < 1990 || year > currentYear) {
      return NextResponse.json({ error: 'Invalid year (1990–now)' }, { status: 400 });
    }
  }

  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: {
      ...(internetYear !== undefined ? { internetYear: Number(internetYear) } : {}),
      ...(bio !== undefined ? { bio: String(bio).slice(0, 160) } : {}),
    },
  });

  return NextResponse.json({ ok: true, internetYear: user.internetYear, bio: user.bio });
}
