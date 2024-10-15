import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; 
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { options } from '../auth/[...nextauth]/options';
import { decrypt } from '@/lib/session';

const prisma = new PrismaClient();

// change password by getting user Email from session
export async function POST(req: Request) {
  const { oldPassword, newPassword } = await req.json();

  // Get the session to get user info
  const session = await getServerSession(options);
  const sessionCookie = cookies().get("session");
  const user =
    session?.user ||
    (sessionCookie ? await decrypt(sessionCookie.value) : null);

  // Check if session exists
  if (!user) {
    return new Response(
      JSON.stringify({ message: 'Session is invalid or expired' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const userEmail = user.email; // Adjust if necessary

  try {
    const user = await prisma.users.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return new Response(
        JSON.stringify({ message: 'Invalid old password' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { user_id: user.user_id }, // Use user_id instead of email if needed
      data: { password: hashedNewPassword, updated_at: new Date() },
    });

    return new Response(
      JSON.stringify({ message: 'Password updated successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error updating password:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
