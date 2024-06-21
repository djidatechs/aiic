import { PrismaClient } from '@prisma/client';

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
    
    const res = workingHours.map((wh) =>{ 
      return ({
      id: wh.id,
      startTime: wh.date.toUTCString().split(' ')[4].split(':').slice(0, 2).join(':'),
      type: wh.type,
      duration: wh.duration,
      available: wh.appointment == undefined,
      confirmed : wh.appointment && wh.appointment.payment ? 
      wh.appointment.payment.recite_path != null || wh.appointment.payment?.payed !=0
      : false
    })})

    res.sort((a, b) => {
      const [aHours, aMinutes] = a.startTime.split(':').map(Number);
      const [bHours, bMinutes] = b.startTime.split(':').map(Number);
      return aHours - bHours || aMinutes - bMinutes;
    });


        return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch working hours' }), { status: 500 });
  }
};


