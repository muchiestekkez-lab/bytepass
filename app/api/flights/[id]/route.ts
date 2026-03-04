import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/flights/[id] — public, used for boarding pass page
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const flight = await prisma.flight.findUnique({
    where: { id: params.id },
    include: {
      from: true,
      to: true,
      user: { select: { username: true } },
    },
  });

  if (!flight) {
    return NextResponse.json({ error: 'Flight not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: flight });
}
