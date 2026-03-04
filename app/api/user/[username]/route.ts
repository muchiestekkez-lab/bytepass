import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/user/[username] — public profile data
export async function GET(_req: Request, { params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      id: true,
      username: true,
      bio: true,
      internetYear: true,
      createdAt: true,
      flights: {
        include: { from: true, to: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: user });
}
