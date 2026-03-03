import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Delivery from '@/models/Delivery';

export async function GET() {
    try {
        await dbConnect();
        const deliveries = await Delivery.find({}).sort({ createdAt: -1 });
        return NextResponse.json(deliveries);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch deliveries' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const delivery = await Delivery.create(body);
        return NextResponse.json(delivery, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create delivery' }, { status: 500 });
    }
}
