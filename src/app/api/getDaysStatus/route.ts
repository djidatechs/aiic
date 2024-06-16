// pages/api/getDaysStatus.ts
import { PrismaClient, AppointmentType } from '@prisma/client';


const prisma = new PrismaClient();

export const GET = async () => {
  try {
    // Fetch all working hours
    const workingHours = await prisma.workingHours.findMany({
      include: {
        
        appointments: {
          include: {
            client: true,
            payment: true,
          },
        },
      },
    });
    // Initialize sets to store date strings
   

    const filledDays = [];
    const filledNoPaymentDays = [];
    const availableDays = [];

    // Group working hours by date and categorize them
    const groupedByDate = workingHours.reduce((acc:any, curr) => {
      const date = toLocalISOString(curr.date)

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(curr);
      return acc;
    }, {});
    console.log({groupedByDate})

    // Process each grouped day
    for (const [date, hours] of Object.entries(groupedByDate)) {
      const filledHours = [];
      const filledNoPaymentHours = [];
      const availableHours = [];
    
      for (const hour of (hours as any) ) {
        const appointment = hour.appointments;
    
        if (!appointment) {
          availableHours.push(hour);
        } else {
          const payment = appointment.payment;
          if (payment && (payment.payed > 0 || payment.recite)) {
            filledHours.push(hour);
          } else {
            filledNoPaymentHours.push(hour);
          }
        }
      }
      
      const len = (hours as any).length;
    
      if (availableHours.length > 0) {
        availableDays.push({ day: date, workingHoursInstances: availableHours });
      } else if (filledHours.length > 0 && filledHours.length === len) {
        filledDays.push({ day: date, workingHoursInstances: filledHours });
      } else if (filledNoPaymentHours.length === len) {
        filledNoPaymentDays.push({ day: date, workingHoursInstances: filledNoPaymentHours });
      } else {
        // New condition to handle mixed appointments
        filledNoPaymentDays.push({ day: date, workingHoursInstances: [...filledHours, ...filledNoPaymentHours] });
      }
    }  
    const res = {
      filled_days: filledDays,
      maybe_filled_days: filledNoPaymentDays,
      allowed_days: availableDays,
    };
    
    await prisma.$disconnect();
    return Response.json(res , {status:200});
    



  } catch (error) {
    await prisma.$disconnect();
    return  Response.json({ error: 'Failed to fetch days status' },{status:500});
  } 
};



function toLocalISOString(date:Date) {
  const pad = (num:any) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}