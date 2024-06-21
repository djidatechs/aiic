import { NextRequest, NextResponse } from 'next/server'; // Import from 'next/server' for the app directory.
import { PrismaClient } from '@prisma/client';
import { workinghours_create_schema } from '@/lib/validator';

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        
        const data = await req.json();
        const validatedData = workinghours_create_schema.parse(data);
        await prisma.workinghours.create({ data: validatedData });
        return NextResponse.json({ success: true });
    } catch (error) { return NextResponse.json({ success: false, error }, { status: 500 });}
}
