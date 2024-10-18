import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// get all subscriptions and filter by status and subtype
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
    }
}

// Create a new subscription
export async function POST(request: Request) {
  const newSubscription = await request.json();

  // Validate required fields
  const { user_id, sub_type } = newSubscription;
  if (!user_id || !sub_type) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    // Create a new subscription entry
    const subscription = await prisma.user_subscription.create({
      data: {
        user_id,
        sub_type,
        status: 'active', // Set default status; adjust if necessary
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
