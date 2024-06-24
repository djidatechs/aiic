import { NextRequest, NextResponse } from 'next/server'; // Import from 'next/server' for the app directory.
import { PrismaClient } from '@prisma/client';
import { FormSchema, FormValues } from '@/lib/validator';

const prisma = new PrismaClient();

// Handle POST request to create a new appointment
export async function POST(req: NextRequest) {

    try {
        const data: FormValues = await req.json();
        const validatedData =  FormSchema.parse(data);
        const ipAddress = req.headers.get('x-forwarded-for') || req.ip || null;
        const wh = await prisma.workinghours.findFirst({where:{id: validatedData.WorkingHour}})
        if (wh?.state != 'ACTIVE') return  NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })

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
        const appointment = await prisma.appointment .create({
            data: {
                description : validatedData.additionalInfo,
                clientId: client.id,
                WorkingHoursId: validatedData.WorkingHour, // assuming a valid WorkingHours ID
                
            },
        });
        const amount = parseInt (process.env.PAYEMENT_AMOUNT || '0' )
        await prisma.payment.create({
            data: {
                amount: amount,
                payed: 0, // Update as needed
                appointmentId: appointment.id,
            },
        });
        return NextResponse.json({ success: true, appointment });
    } catch (error) { return NextResponse.json({ success: false, error: error }, { status: 500 });}
}
