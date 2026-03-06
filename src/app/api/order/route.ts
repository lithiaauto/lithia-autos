import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { firstName, lastName, email, phone, address, city, state, zipCode, country, paymentMethod, paymentMethodLabel, cart, total, orderId } = body;

        if (!email || !cart || cart.length === 0) {
            return NextResponse.json({ error: 'Email and cart items are required' }, { status: 400 });
        }

        // Save order to database
        const now = new Date();
        const expectedProcessingDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
        const expectedShippedDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        const newOrder = await Order.create({
            ...body,
            trackingDetails: {
                destination: `${city}, ${state}`
            }
        });

        const cartHtml = cart.map((item: any) => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title} (${item.year})</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price}</td>
            </tr>
        `).join('');

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <h1 style="color: #0c1b33; border-bottom: 2px solid #eab308; padding-bottom: 10px;">Order Confirmation</h1>
                <p>Hello ${firstName},</p>
                <p>Thank you for your order with <strong>Lithia Autos</strong>. Your order has been placed successfully and is being processed.</p>
                
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Order ID:</strong> ${orderId}</p>
                    <p style="margin: 5px 0 0 0;"><strong>Total Amount:</strong> $${total.toLocaleString()}</p>
                </div>

                <h3>Order Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #eee;">
                            <th style="padding: 10px; text-align: left;">Item</th>
                            <th style="padding: 10px; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cartHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td style="padding: 10px; font-weight: bold;">Total</td>
                            <td style="padding: 10px; font-weight: bold; text-align: right;">$${total.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>

                <h3>Shipping Info</h3>
                <p style="margin: 0;">${address}</p>
                <p style="margin: 5px 0 0 0;">${city}, ${state} ${zipCode}</p>
                <p style="margin: 5px 0 0 0;">${country}</p>
                <p style="margin: 5px 0 0 0;">Phone: ${phone}</p>

                <h3>Payment Method</h3>
                <p>${paymentMethodLabel || paymentMethod.replace('_', ' ').toUpperCase()}</p>
                
                ${paymentMethod === 'bank_transfer' || (paymentMethodLabel && paymentMethodLabel.toLowerCase().includes('bank')) ? `
                    <div style="background: #fff9e6; border-left: 4px solid #eab308; padding: 15px; margin-top: 20px;">
                        <p style="margin: 0; font-weight: bold;">Action Required: Bank Transfer</p>
                        <p style="margin: 5px 0 0 0; font-size: 14px;">Please transfer the total amount to the following account to finalize your purchase:</p>
                        <p style="margin: 10px 0 0 0; font-size: 14px;"><strong>Bank:</strong> Lithia Global Bank<br><strong>Account:</strong> 1234567890<br><strong>Reference:</strong> ${orderId}</p>
                    </div>
                ` : ''}

                <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">&copy; ${new Date().getFullYear()} Lithia Autos. All rights reserved.</p>
            </div>
        `;

        // Send to customer
        await sendEmail(email, `Order Confirmation: ${orderId}`, html);

        // Send notification to admin
        await sendEmail(
            process.env.SMTP_EMAIL || 'support@lithiaautos.com',
            `New Order Received: ${orderId}`,
            `<h2>New Order from ${firstName} ${lastName}</h2><p>Amount: $${total.toLocaleString()}</p><p>Check admin dashboard for details.</p>`
        );

        return NextResponse.json({ message: 'Order processed and emails sent', order: newOrder });
    } catch (error) {
        console.error('Error in order API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
