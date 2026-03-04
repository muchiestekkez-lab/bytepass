import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'bytepass_token';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'bytepass-fallback-secret-change-me'
);

export type AuthPayload = {
  userId: string;
  username: string;
};

/** Sign a new JWT and return the token string */
export async function signToken(payload: AuthPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/** Verify a JWT string and return the payload, or null if invalid */
export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

/** Read auth cookie and return the decoded user, or null if unauthenticated */
export async function getAuthUser(): Promise<AuthPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Set the auth cookie on a Response headers object */
export function setAuthCookie(headers: Headers, token: string) {
  headers.append(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );
}

/** Clear the auth cookie */
export function clearAuthCookie(headers: Headers) {
  headers.append(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}
