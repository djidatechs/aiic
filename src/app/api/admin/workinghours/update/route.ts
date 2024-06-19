import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { workinghoursSchema } from '@/lib/validator'; // Adjust path as per your actual setup

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const updateSchema = workinghoursSchema.partial()
    let  id  =  req.nextUrl.searchParams.get("id");
    const data : typeof updateSchema = await req.json();
    if (!id || isNaN(parseInt(id)) ||  ! data) return NextResponse.json({ success: false, error : "Can't update" }, { status: 500 });
    
    const validatedData = updateSchema.parse(data);
    const updatedWorkingHours = await prisma.workinghours.update({
      where: { id: parseInt(id) },
      data: validatedData,
    });
    
    return NextResponse.json({ success: true, updatedWorkingHours });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
