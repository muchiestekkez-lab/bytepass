import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** GET /api/follow?username=xxx — check follow status */
export async function GET(req: Request) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ following: false });

  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  if (!username) return NextResponse.json({ following: false });

  const target = await prisma.user.findUnique({ where: { username }, select: { id: true } });
  if (!target) return NextResponse.json({ following: false });

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: auth.userId, followingId: target.id } },
  });

  return NextResponse.json({ following: !!existing });
}

/** POST /api/follow — toggle follow for { username } */
export async function POST(req: Request) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { username } = await req.json();
  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

  const target = await prisma.user.findUnique({ where: { username }, select: { id: true } });
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (target.id === auth.userId) return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });

  const key = { followerId: auth.userId, followingId: target.id };

  const existing = await prisma.follow.findUnique({ where: { followerId_followingId: key } });

  if (existing) {
    await prisma.follow.delete({ where: { followerId_followingId: key } });
    return NextResponse.json({ following: false });
  } else {
    await prisma.follow.create({ data: key });
    return NextResponse.json({ following: true });
  }
}
