import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
    // Check if the request method is GET
    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    try {
        const subscriptionTypes = await prisma.subscription_type.findMany();
        return NextResponse.json(subscriptionTypes, { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return NextResponse.json({ error: 'Failed to fetch subscription types' }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure the Prisma client is disconnected
    }
}

