import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { generateFlightNumber } from '@/lib/utils';

// GET /api/flights — list authenticated user's flights
export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const flights = await prisma.flight.findMany({
    where: { userId: auth.userId },
    include: { from: true, to: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ ok: true, data: flights });
}

// POST /api/flights — create a new flight
export async function POST(req: Request) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { fromId, toId, reason } = await req.json();

    if (!fromId || !toId) {
      return NextResponse.json({ error: 'From and To platforms are required.' }, { status: 400 });
    }

    if (fromId === toId) {
      return NextResponse.json({ error: 'From and To platforms must be different.' }, { status: 400 });
    }

    // Validate platforms exist
    const [from, to] = await Promise.all([
      prisma.platform.findUnique({ where: { id: fromId } }),
      prisma.platform.findUnique({ where: { id: toId } }),
    ]);

    if (!from || !to) {
      return NextResponse.json({ error: 'Invalid platform selected.' }, { status: 400 });
    }

    // Ensure flight number is unique
    let flightNumber = generateFlightNumber();
    let attempts = 0;
    while (await prisma.flight.findUnique({ where: { flightNumber } })) {
      flightNumber = generateFlightNumber();
      if (++attempts > 5) break;
    }

    const flight = await prisma.flight.create({
      data: {
        flightNumber,
        userId: auth.userId,
        fromId,
        toId,
        reason: reason?.trim() || null,
      },
      include: { from: true, to: true },
    });

    return NextResponse.json({ ok: true, data: flight }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/flights]', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
