import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        // This endpoint is meant for the order receipt page, which is accessed 
        // immediately after placing an order and only knows the orderId.
        // We do NOT require an email here (unlike the public tracking page).
        const order = await Order.findOne({ orderId: id });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({
            orderId: order.orderId,
            status: order.status,
            createdAt: order.createdAt,
            firstName: order.firstName,
            lastName: order.lastName,
            email: order.email,
            phone: order.phone,
            address: order.address,
            city: order.city,
            state: order.state,
            zipCode: order.zipCode,
            country: order.country,
            trackingDetails: order.trackingDetails
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve order' }, { status: 500 });
    }
}
