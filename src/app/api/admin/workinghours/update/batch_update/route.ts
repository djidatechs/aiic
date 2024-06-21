import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { workinghours_updatebatch_schema } from '@/lib/validator'; // Adjust path as per your actual setup

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const updateSchema = workinghours_updatebatch_schema
    const data  = await req.json();
    const validatedData = updateSchema.safeParse(data);

    if (!validatedData.success) {
      console.log({errors: validatedData.error})
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        errors: validatedData.error?.errors.map((err) => err.message) || [],
      }, { status: 400 });
    }
    validatedData.data.map(
      async (row) => {
        const id = row.id
        if (!id || isNaN(id)) return NextResponse.json({ success: false, error : "Can't update" }, { status: 500 });
        await prisma.workinghours.update({
          where: { id: id },
          data: row,
        });
      }
    )

  
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
