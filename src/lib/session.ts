import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@/lib/definitions';
import { cookies } from 'next/headers';

const secretKey = process.env.NEXTAUTH_SECRET;

if (!secretKey) {
  throw new Error('NEXTAUTH_SECRET environment variable is not set');
}

const encodedKey = new TextEncoder().encode(secretKey);

// Function to encrypt the session payload
export async function encrypt(payload: SessionPayload) {
  try {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(encodedKey);
  } catch (error) {
    console.error('Error encrypting the payload:', error);
    throw new Error('Failed to encrypt session');
  }
}

// Function to decrypt the session token
export async function decrypt(session: string | undefined = '') {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Failed to verify session:', error);
    return null;
  }
}

// Create a session and set the cookie
export async function createSession(userId: string, name: string, email: string) {
  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day expiration
    const session = await encrypt({
      userId,
      expiresAt,
      email,
      name,
      role: '',
    });

    cookies().set({
      name: 'session',
      value: session,
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    });

    return session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error('Failed to create session');
  }
}

// Update the session cookie with a new expiration time
export async function updateSession() {
  const sessionCookie = cookies().get('session')?.value;

  if (!sessionCookie) {
    console.log('No session found');
    return null;
  }

  const payload = await decrypt(sessionCookie);
  if (!payload) {
    console.log('Invalid session payload');
    return null;
  }

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Extend for 1 day

  cookies().set({
    name: 'session',
    value: sessionCookie,
    httpOnly: true,
    secure: true,
    expires,
    sameSite: 'lax',
    path: '/',
  });

  return payload;
}

// Delete the session cookie
export async function deleteSession() {
  try {
    const cookieStore = cookies();
    const cookieNames = [
      'session',
      'next-auth.session-token',
      'next-auth.callback-url',
      'next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
      '__Secure-next-auth.callback-url',
      '__Secure-next-auth.pkce.code_verifier',
      '__Secure-next-auth.session-token',
    ];

    cookieNames.forEach((name) => {
      cookieStore.delete({
        name,
        path: '/',
        // Use a domain that matches your Vercel deployment
        domain: process.env.NEXT_PUBLIC_DOMAIN || undefined,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
      });
    });

    console.log('All session cookies deleted successfully');
    return { success: true, message: 'Logout successful' };
  } catch (error) {
    console.error('Error deleting session:', error);
    throw new Error('Failed to delete session');
  }
}