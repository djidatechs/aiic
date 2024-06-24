// api/appointment/get/[id]

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { appointment_get_by_id_schema } from '@/lib/validator';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
const prisma = new PrismaClient();
export  async function GET(req: NextRequest, {params}:any) {
  try {
    const validatedParams = appointment_get_by_id_schema.safeParse(params.id);
    if (!validatedParams.success) {
      console.log({errors: validatedParams.error})
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        errors: validatedParams.error?.errors.map((err) => err.message) || [],
      }, { status: 400 });
    }
    const id = validatedParams.data
    if (!id || isNaN(id)) return  NextResponse.json({ success: false, error:'Bad Param' }, { status: 500 });
    const appointment = await prisma.appointment.findFirst({
      where:{
        id: id        
      },
      include : {
        client : true,
        payment: true,
        workinghours : {select: {type:  true}},
        params : {select : {seen : true , adminId: true}}
      }
    });

    //seen by admin 
    const adminId=  (await getServerSession(authOptions) as any )?.admin?.id as number
    console.log( await getServerSession(authOptions))
    console.log({adminId})
    // if (appointment?.id)
    // if (! ( appointment?.params && appointment?.params?.some( (param) => param.adminId== adminId &&  param.seen == true)))
    //     await prisma.admin_appointment_params.upsert({
    //       where : {adminId, appointmentId : appointment?.id},
    //       create: {adminId, appointmentId : appointment?.id, seen:true},
    //       update: {seen:true},

    //   })
      
      

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json({ success: false, error: error || 'Internal server error' }, { status: 500 });
  }
}
