import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 30; // ISR: revalidate every 30 seconds

/** GET /api/feed/global — last 50 flights from everyone */
export async function GET() {
  const flights = await prisma.flight.findMany({
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
