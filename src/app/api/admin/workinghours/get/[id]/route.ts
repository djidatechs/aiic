// api/workinghours/get/[id]

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { workinghours_get_by_id_schema } from '@/lib/validator';
const prisma = new PrismaClient();
export  async function GET(req: NextRequest, {params}:any) {
  try {
    const validatedParams = workinghours_get_by_id_schema.safeParse(params.id);
    if (!validatedParams.success) {
      console.log({errors: validatedParams.error})
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        errors: validatedParams.error?.errors.map((err) => err.message) || [],
      }, { status: 400 });
    }
    console.log(validatedParams.data)
    const id = validatedParams.data
    if (!id || isNaN(id)) return  NextResponse.json({ success: false, error:'Bad Param' }, { status: 500 });
    const workinghours = await prisma.workinghours.findFirst({
      where:{
        id: id
      },
    });
    return NextResponse.json({ success: true, workinghours });
  } catch (error) {
    console.error("Error fetching workinghours:", error);
    return NextResponse.json({ success: false, error: error || 'Internal server error' }, { status: 500 });
  }
}
