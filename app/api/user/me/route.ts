import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { internetYear, bio, avatar, passportColor } = body;

  const currentYear = new Date().getFullYear();
  if (internetYear !== undefined) {
    const year = Number(internetYear);
    if (!Number.isInteger(year) || year < 1990 || year > currentYear) {
      return NextResponse.json({ error: 'Invalid year (1990–now)' }, { status: 400 });
    }
  }

  // avatar must be a base64 data URL or a https:// URL; reject anything else
  if (avatar !== undefined && avatar !== null) {
    const isDataUrl = typeof avatar === 'string' && avatar.startsWith('data:image/');
    const isHttpsUrl = typeof avatar === 'string' && avatar.startsWith('https://');
    if (!isDataUrl && !isHttpsUrl) {
      return NextResponse.json({ error: 'Invalid avatar format' }, { status: 400 });
    }
  }

  const VALID_COLORS = ['indigo', 'rose', 'emerald', 'amber', 'sky', 'violet'];
  if (passportColor !== undefined && !VALID_COLORS.includes(passportColor)) {
    return NextResponse.json({ error: 'Invalid passport color' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: {
      ...(internetYear !== undefined ? { internetYear: Number(internetYear) } : {}),
      ...(bio !== undefined ? { bio: String(bio).slice(0, 160) } : {}),
      ...(avatar !== undefined ? { avatar: avatar ?? null } : {}),
      ...(passportColor !== undefined ? { passportColor } : {}),
    },
  });

  return NextResponse.json({ ok: true, internetYear: user.internetYear, bio: user.bio, avatar: user.avatar, passportColor: user.passportColor });
}
