import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PaymentMethod from '@/models/PaymentMethod';

export async function GET() {
    try {
        await dbConnect();
        const methods = await PaymentMethod.find({}).sort({ createdAt: -1 });
        return NextResponse.json(methods);
    } catch (error: any) {
        console.error('Error fetching payment methods:', error);
        return NextResponse.json({ error: 'Failed to fetch payment methods', details: error.message, stack: error.stack }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        if (!body.label) {
            return NextResponse.json({ error: 'Label is required' }, { status: 400 });
        }

        if (!body.identifier) {
            body.identifier = body.label.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-6);
        }
        const method = await PaymentMethod.create(body);
        return NextResponse.json(method);
    } catch (error: any) {
        console.error('Error creating payment method:', error);
        return NextResponse.json({ error: 'Failed to create payment method', details: error.message, stack: error.stack }, { status: 500 });
    }
}
