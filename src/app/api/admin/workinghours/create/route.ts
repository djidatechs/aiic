import { NextRequest, NextResponse } from 'next/server'; // Import from 'next/server' for the app directory.
import { PrismaClient } from '@prisma/client';
import { workinghours_create_schema } from '@/lib/validator';

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        
        const data = await req.json();
        const validatedData = workinghours_create_schema.safeParse(data);
        if (!validatedData.success) {
            console.log(validatedData.error)
            return NextResponse.json({
              success: false,
              error: 'Invalid query parameters',
              errors: validatedData.error?.errors.map((err) => err.message) || [],
            }, { status: 400 });
          }

        const wh = await prisma.workinghours.create({ data: validatedData.data });
        return NextResponse.json({ success: true , wh });
    } catch (error) { return NextResponse.json({ success: false, error }, { status: 500 });}
}
