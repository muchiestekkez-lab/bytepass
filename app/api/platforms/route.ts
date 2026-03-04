import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const platforms = await prisma.platform.findMany({
    orderBy: { order: 'asc' },
  });
  return NextResponse.json({ ok: true, data: platforms });
}
