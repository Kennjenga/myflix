import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const users = await prisma.users.findMany();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
