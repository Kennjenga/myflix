import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    
    if (session) {
      // Perform any server-side cleanup here
      // For example, you might want to invalidate the session in your database
      
      // Note: `req.session = null` won't work here as `req` is not an Express request
      // NextAuth handles session clearing automatically
    }

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'An error occurred during logout' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}