import { NextRequest, NextResponse } from 'next/server'; // Import from 'next/server' for the app directory.
import { PrismaClient } from '@prisma/client';
import { FormSchema, FormValues } from '@/lib/validator';

const prisma = new PrismaClient();

// Handle POST request to create a new appointment
export async function POST(req: NextRequest) {

    try {
        // Extract the parsed JSON body directly
        const data: FormValues = await req.json();

        // Validate input data using Zod schema
        const validatedData = FormSchema.parse(data);

        // Extract the client's IP address from the request
        const ipAddress = req.headers.get('x-forwarded-for') || req.ip || null;

        // Create the client record
        const client = await prisma.client.create({
            data: {
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                age: parseInt(validatedData.age, 10),
                phoneNumber: validatedData.phoneNumber,
                email: validatedData.email,
                wilaya: validatedData.wilaya,
                ipAddress: ipAddress ? ipAddress.split(',')[0].trim() : null, // Get the first IP if x-forwarded-for has multiple addresses
            },
        });

        // Create the appointment record
        const appointment = await prisma.appointment .create({
            data: {
                clientId: client.id,
                WorkingHoursId: validatedData.WorkingHour, // assuming a valid WorkingHours ID
                
            },
        });

        // Create the payment record if payment details are provided
        if (validatedData.PaymentMethod) {
            await prisma.payment.create({
                data: {
                    amount: 0, // Update as needed
                    payed: 0, // Update as needed
                    paymentMethod: validatedData.PaymentMethod,
                    appointmentId: appointment.id,
                },
            });
        }

        // Respond with the created appointment
                return NextResponse.json({ success: true, appointment });
    } catch (error) {
                return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}
