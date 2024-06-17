import { NextRequest, NextResponse } from 'next/server'; // Import from 'next/server' for the app directory.
import { PrismaClient } from '@prisma/client';
import { fileSchema, fileValues } from '@/lib/validator';
import { generateRandomString } from '@/lib/functions';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {

    try {
        // Extract the parsed JSON body directly
        const data: fileValues = await req.json();
        // Validate input data using Zod schema
        const validatedData = fileSchema.parse(data);

        const ftp_path = generateRandomString(12);



  

        // Create the appointment record
       

        // Respond with the created appointment
                return NextResponse.json({ success: true});
    } catch (error) {
                return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}
