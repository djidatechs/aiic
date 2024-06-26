import { localetime_options } from '@/lib/utils';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const GET = async (req: Request) => {
  try {
    // Extract date parameter from query
    const url = new URL(req.url);
    const date = url.searchParams.get('date');

    if (!date) {
      return new Response(JSON.stringify({ error: 'Date parameter is required' }), { status: 400 });
    }

  

    // Fetch working hours for the specified date
    const workingHours = await prisma.workinghours.findMany({
      where: {
        state : "ACTIVE",
        date: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lt: new Date(`${date}T23:59:59.999Z`),
        },
      },
      include: {
        appointment: {
          include: {
            client: true,
            payment: true,
          },
        },
      },
    });
    
    
    const data = workingHours.map((wh) =>{ 
      let date = new Date(wh.date);
      return ({
      id: wh.id,
      startTime: date.toLocaleTimeString('en-GB', localetime_options).slice(0, 5),
      type: wh.type,
      duration: wh.duration,
      available: wh.appointment == undefined,
      confirmed : wh.appointment && wh.appointment.payment ? 
      wh.appointment.payment.recite_path != null || wh.appointment.payment?.payed !=0
      : false
    })})

    data.sort((a, b) => {
      const [aHours, aMinutes] = a.startTime.split(':').map(Number);
      const [bHours, bMinutes] = b.startTime.split(':').map(Number);
      return aHours - bHours || aMinutes - bMinutes;
    });


      return NextResponse.json({ success: true, data });
        
  } catch (error) {
      return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
};


