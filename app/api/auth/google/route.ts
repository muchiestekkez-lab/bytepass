import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/auth/google — redirect user to Google's consent screen
export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const { protocol, host } = new URL(request.url);
  const redirectUri = `${protocol}//${host}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
