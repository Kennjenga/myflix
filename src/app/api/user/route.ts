import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// get user by email if email param provided otherwise get all users
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  try {
    if (email) {
      // Get user by email
      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: user }, { status: 200 });
    } else {
      // Get all users
      const users = await prisma.users.findMany({
        select: {
          user_id: true,
          username: true,
          email: true,
          phone_number: true,
          firstname: true,
          lastname: true,
          created_at: true,
          updated_at: true,
          role: true,
        },
      });

      // Replace NULL values with default placeholders
      const sanitizedUsers = users.map(user => ({
        ...user,
        phone_number: user.phone_number || 'Not provided',
        firstname: user.firstname || 'Unknown',
        lastname: user.lastname || 'Unknown',
        role: user.role || 'User',
      }));

      return NextResponse.json({ success: true, data: sanitizedUsers }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching user(s):', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// post user
export async function POST(request: Request){
  const newUser = await request.json();
  
  if(!newUser.username ||!newUser.email ||!newUser.password){
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const user = await prisma.users.create({
      data: {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password, // Make sure you hash the password in a real-world app
        firstname: newUser.firstname || null,
        lastname: newUser.lastname || null,
        phone_number: newUser.phone_number || null,
        role: newUser.role || "user",
      }
    });
    return NextResponse.json(user);
    
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 

