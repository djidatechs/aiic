// api/appointment/get.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export  async function GET(req: NextRequest, {params}:any) {
  try {
    const id = params.id;
    if (!id || isNaN(parseInt(id))) return  NextResponse.json({ success: false, error:'Bad Param' }, { status: 500 });
    const appointment = await prisma.appointment.findFirst({
      where:{
        id: parseInt(id)
      },
    });
    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json({ success: false, error: error || 'Internal server error' }, { status: 500 });
  }
}
