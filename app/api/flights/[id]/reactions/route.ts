import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const ALLOWED_EMOJIS = ['❤️', '😂', '🔥', '✈️'];

/** GET /api/flights/[id]/reactions — get reaction counts + viewer's own reactions */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthUser();

  const reactions = await prisma.reaction.findMany({
    where: { flightId: params.id },
    select: { emoji: true, userId: true },
  });

  // aggregate counts per emoji
  const counts: Record<string, number> = {};
  const mine: string[] = [];

  for (const r of reactions) {
    counts[r.emoji] = (counts[r.emoji] ?? 0) + 1;
    if (auth && r.userId === auth.userId) mine.push(r.emoji);
  }

  return NextResponse.json({ counts, mine });
}

/** POST /api/flights/[id]/reactions — set ONE reaction per user (switch or add, never remove) */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { emoji } = await req.json();
  if (!ALLOWED_EMOJIS.includes(emoji)) {
    return NextResponse.json({ error: 'Invalid emoji' }, { status: 400 });
  }

  // Find any existing reaction this user has on this flight
  const existing = await prisma.reaction.findFirst({
    where: { flightId: params.id, userId: auth.userId },
  });

  // Already reacted with the same emoji — nothing to do
  if (existing?.emoji === emoji) {
    return NextResponse.json({ reacted: true, emoji, changed: false });
  }

  // Delete previous reaction (if any), then create the new one
  if (existing) {
    await prisma.reaction.delete({ where: { flightId_userId_emoji: { flightId: params.id, userId: auth.userId, emoji: existing.emoji } } });
  }
  await prisma.reaction.create({ data: { flightId: params.id, userId: auth.userId, emoji } });

  return NextResponse.json({ reacted: true, emoji, oldEmoji: existing?.emoji ?? null, changed: true });
}
