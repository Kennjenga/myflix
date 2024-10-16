import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
    try {
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
            }
        });

        // Replace NULL values with default placeholders
        const sanitizedUsers = users.map(user => ({
            ...user,
            phone_number: user.phone_number || 'Not provided',
            firstname: user.firstname || 'Unknown',
            lastname: user.lastname || 'Unknown',
            role: user.role || 'User'
        }));

        return NextResponse.json(sanitizedUsers, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
