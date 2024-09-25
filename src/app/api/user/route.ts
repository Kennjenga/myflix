// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { decrypt } from '@/app/lib/session';

// export async function GET() {
//   const sessionCookie = cookies().get('session'); // Get the session cookie

//   if (!sessionCookie) {
//     return NextResponse.json({ user: null, message: 'No session cookie' }); // Return a JSON response
//   }

//   try {
//     const session = await decrypt(sessionCookie.value); // Decrypt the session cookie
//     if (session && session.username) {
//       return NextResponse.json({ user: { username: session.username } }); // Return user info
//     }
//   } catch (error) {
//     console.error('Error decrypting session:', error);
//   }

//   return NextResponse.json({ user: null }); // Return null if no valid session
// }