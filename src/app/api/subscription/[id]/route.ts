import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id;

    if (!userId) {
        return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    try {
        const subscriptions = await prisma.user_subscription.findMany({
            where: {
                user_id: Number(userId),
            },
            include: {
                subscription_type: true,
                users: true,
            },
        });

        if (subscriptions.length === 0) {
            return NextResponse.json({ message: 'No subscriptions found for this user' }, { status: 404 });
        }

        return NextResponse.json(subscriptions);
    } catch (error) {
        console.error('Error fetching user subscriptions:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}