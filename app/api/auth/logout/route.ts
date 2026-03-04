import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const headers = new Headers();
  clearAuthCookie(headers);
  return NextResponse.json({ ok: true }, { headers });
}
