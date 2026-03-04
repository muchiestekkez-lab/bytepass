import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST() {
  const headers = new Headers();
  clearAuthCookie(headers);
  return NextResponse.json({ ok: true }, { headers });
}
