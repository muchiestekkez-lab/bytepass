import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, username: true, email: true, internetYear: true, bio: true, createdAt: true },
  });

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ ok: true, data: user });
}
