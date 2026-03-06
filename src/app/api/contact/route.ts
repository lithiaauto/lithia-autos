import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: Request) {
    try {
        const { firstName, lastName, email, phone, subject, message } = await request.json();

        if (!email || !message) {
            return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
        }

        const html = `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `;

        const result = await sendEmail(
            process.env.SMTP_EMAIL || 'support@lithiaautos.com',
            `Contact Form: ${subject}`,
            html
        );

        if (result.success) {
            return NextResponse.json({ message: 'Email sent successfully' });
        } else {
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error in contact API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
