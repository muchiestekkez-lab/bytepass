import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** Convert a Google display name into a valid username like "john_doe" */
function nameToUsername(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 18);
}

/** Make sure a username is unique by appending a number if needed */
async function uniqueUsername(base: string): Promise<string> {
  const slug = base || 'user';
  let candidate = slug;
  let i = 1;
  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    candidate = `${slug}${i++}`;
  }
  return candidate;
}

export async function GET(req: Request) {
  const reqUrl = new URL(req.url);
  const { searchParams } = reqUrl;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const appUrl = `${reqUrl.protocol}//${reqUrl.host}`;

  // User denied Google access
  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/login?error=google_denied`);
  }

  try {
    // 1. Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${appUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      console.error('[google/callback] token exchange failed', await tokenRes.text());
      return NextResponse.redirect(`${appUrl}/login?error=google_failed`);
    }

    const { access_token } = await tokenRes.json();

    // 2. Fetch Google user profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!profileRes.ok) {
      return NextResponse.redirect(`${appUrl}/login?error=google_failed`);
    }

    const profile = await profileRes.json();
    // profile: { id, email, name, picture, verified_email }

    if (!profile.email) {
      return NextResponse.redirect(`${appUrl}/login?error=no_email`);
    }

    // 3. Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: profile.id }, { email: profile.email }],
      },
    });

    if (user) {
      // Update googleId and avatar if not set yet (linked existing account)
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: profile.id,
            avatar: user.avatar || profile.picture || null,
          },
        });
      }
    } else {
      // New user — create account from Google profile
      const baseUsername = nameToUsername(profile.name || profile.email.split('@')[0]);
      const username = await uniqueUsername(baseUsername);

      user = await prisma.user.create({
        data: {
          username,
          email: profile.email,
          password: null,
          googleId: profile.id,
          avatar: profile.picture || null,
          internetYear: new Date().getFullYear() - 5, // default; user edits in Settings
          bio: null,
        },
      });
    }

    // 4. Sign JWT and set cookie
    const token = await signToken({ userId: user.id, username: user.username });
    const headers = new Headers();
    setAuthCookie(headers, token);
    headers.set('Location', `${appUrl}/dashboard`);

    return new Response(null, { status: 302, headers });
  } catch (err) {
    console.error('[google/callback]', err);
    return NextResponse.redirect(`${appUrl}/login?error=server_error`);
  }
}
