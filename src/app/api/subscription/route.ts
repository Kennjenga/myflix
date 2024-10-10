import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const subType = searchParams.get('sub_type');

    try {
        const filters: any = {};

        if (status) {
            filters.status = status;
        }

        if (subType) {
            const subTypeInt = parseInt(subType, 10);
            if (!isNaN(subTypeInt)) {
                filters.subscription_type_id = subTypeInt;
            }
        }

        const subscriptions = await prisma.user_subscription.findMany({
            where: filters,
            include: {
                subscription_type: true,
                users: true,
            },
        });

        return NextResponse.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}