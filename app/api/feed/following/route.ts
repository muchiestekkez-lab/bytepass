import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** GET /api/feed/following — last 50 flights from people I follow */
export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // get ids of users this person follows
  const follows = await prisma.follow.findMany({
    where: { followerId: auth.userId },
    select: { followingId: true },
  });
  const followingIds = follows.map((f) => f.followingId);

  if (followingIds.length === 0) {
    return NextResponse.json([]);
  }

  const flights = await prisma.flight.findMany({
    where: { userId: { in: followingIds } },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      flightNumber: true,
      reason: true,
      createdAt: true,
      user: { select: { username: true, avatar: true } },
      from: { select: { name: true, slug: true, color: true } },
      to:   { select: { name: true, slug: true, color: true } },
      _count: { select: { reactions: true, comments: true } },
    },
  });

  return NextResponse.json(flights);
}
