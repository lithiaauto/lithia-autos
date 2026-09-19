import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Car from '@/models/Car';

export async function GET() {
    try {
        await connectToDatabase();
        const cars = await Car.find({}).sort({ createdAt: -1 });
        return NextResponse.json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const data = await request.json();

        // Map frontend fields specifically if they differ from model
        const carData = {
            ...data,
            carModel: data.carModel || data.model, // Handle both for safety
            fuelType: data.fuelType || data.fuel,
            sellerInfo: {
                name: data.sellerName || 'Lithia Autos',
                phone: data.sellerPhone || '(708) 419-2546',
                location: data.sellerLocation || 'United States'
            },
            features: data.features || {
                convenience: [],
                entertainment: [],
                exterior: [],
                safety: [],
                interior: [],
                seating: [],
                other: []
            }
        };

        const newCar = await Car.create(carData);
        return NextResponse.json(newCar, { status: 201 });
    } catch (error: any) {
        console.error('Error creating car:', error);
        if (error.code === 11000) {
            return NextResponse.json({ error: 'VIN already exists in inventory' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
    }
}
