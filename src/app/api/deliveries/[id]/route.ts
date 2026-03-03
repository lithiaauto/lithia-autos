import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Delivery from '@/models/Delivery';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const delivery = await Delivery.findByIdAndUpdate(id, body, { new: true });
        if (!delivery) {
            return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
        }
        return NextResponse.json(delivery);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update delivery' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const delivery = await Delivery.findByIdAndDelete(id);
        if (!delivery) {
            return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Delivery deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete delivery' }, { status: 500 });
    }
}
