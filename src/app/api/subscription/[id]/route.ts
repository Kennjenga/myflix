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

// PATCH by id to change from sub_Type from active to cancel and modify subscription type
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const subId = Number(params.id);

    if (!subId) {
        return NextResponse.json({ message: 'Invalid subscription ID' }, { status: 400 });
    }

    try {
        // Extract the request body
        const body = await request.json();

        // Determine the action: modify or cancel
        if (body.newTypeId) {
            // Handle modifying the subscription
            const updatedSubscription = await prisma.user_subscription.update({
                where: {
                    sub_id: subId,
                },
                data: {
                    sub_type: body.newTypeId, // Update the subscription type
                    status: 'active',          // Ensure the status is set to active when modifying
                },
            });

            if (!updatedSubscription) {
                return NextResponse.json({ message: 'No subscription found for this ID' }, { status: 404 });
            }

            return NextResponse.json(updatedSubscription);
        } else if (body.cancel) {
            // Handle cancelling the subscription
            const cancelledSubscription = await prisma.user_subscription.update({
                where: {
                    sub_id: subId,
                },
                data: {
                    status: 'cancelled', // Set the status to cancelled
                },
            });

            if (!cancelledSubscription) {
                return NextResponse.json({ message: 'No subscription found for this ID' }, { status: 404 });
            }

            return NextResponse.json(cancelledSubscription);
        } else {
            return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error updating subscription:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
