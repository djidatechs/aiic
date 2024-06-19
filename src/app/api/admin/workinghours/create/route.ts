import { NextRequest, NextResponse } from 'next/server'; // Import from 'next/server' for the app directory.
import { PrismaClient } from '@prisma/client';
import { workinghoursSchema, workinghoursValues } from '@/lib/validator';

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        const data: workinghoursValues = await req.json();
        const validatedData = workinghoursSchema.parse(data);
        await prisma.workinghours.create({ data: validatedData });
        return NextResponse.json({ success: true });
    } catch (error) { return NextResponse.json({ success: false, error }, { status: 500 });}
}
