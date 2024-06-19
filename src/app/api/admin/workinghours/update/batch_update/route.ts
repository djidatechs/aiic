import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { workinghoursSchema } from '@/lib/validator'; // Adjust path as per your actual setup

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const updateSchema = workinghoursSchema.partial();
    const requestData = await req.json();

    if (!Array.isArray(requestData) || requestData.length === 0) {
      return NextResponse.json({ success: false, error: "No valid data provided" }, { status: 400 });
    }
    
    const results = [];

    for (const item of requestData) {
      const id = item.id;
      const data = item.data;

      if (!id || isNaN(parseInt(id)) || !data) {
        results.push({ id, success: false, error: "Invalid ID or missing data" });
        continue;
      }

      const validatedData = updateSchema.parse(data);
      
      try {
        const updatedWorkingHours = await prisma.workinghours.update({
          where: { id: parseInt(id) },
          data: validatedData,
        });

        results.push({ id, success: true, updatedWorkingHours });
      } catch (error) {
        results.push({ id, success: false, error: error });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
