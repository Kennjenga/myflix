import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const url = new URL(request.url);
    const userId = params.id;
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("limit") || "12");

    if (!userId) {
        return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    try {
        // Get total subscription count for this user
        const totalItems = await prisma.user_subscription.count({
            where: {
                user_id: Number(userId),
            },
        });

        const subscriptions = await prisma.user_subscription.findMany({
            where: {
                user_id: Number(userId),
            },
            include: {
                subscription_type: true,
                users: true,
            },
            take: pageSize,
            skip: (page - 1) * pageSize, // Pagination logic
        });

        if (subscriptions.length === 0) {
            return NextResponse.json({ message: 'No subscriptions found for this user' }, { status: 404 });
        }

        const totalPages = Math.ceil(totalItems / pageSize);

        return NextResponse.json({
            subscriptions,
            totalPages,
            currentPage: page,
            totalItems,
        });
    } catch (error) {
        console.error('Error fetching user subscriptions:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
