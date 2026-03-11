import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PaymentMethod from '@/models/PaymentMethod';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const method = await PaymentMethod.findByIdAndUpdate(id, body, { new: true });
        if (!method) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(method);
    } catch (error: any) {
        console.error('Update payment method failed:', error);
        return NextResponse.json({ error: 'Update failed', details: error.message, stack: error.stack }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const method = await PaymentMethod.findByIdAndDelete(id);
        if (!method) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete payment method failed:', error);
        return NextResponse.json({ error: 'Delete failed', details: error.message, stack: error.stack }, { status: 500 });
    }
}
