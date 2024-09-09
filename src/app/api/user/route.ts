import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session'; // Adjust the import path as needed

export async function GET() {
  const sessionCookie = cookies().get('session');
  
  if (!sessionCookie) {
    return NextResponse.json({ user: null });
  }

  try {
    const session = await decrypt(sessionCookie.value);
    if (session && session.username) {
      return NextResponse.json({ user: { username: session.username } });
    }
  } catch (error) {
    console.error('Error decrypting session:', error);
  }

  return NextResponse.json({ user: null });
}