import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    // Fetch all working hours
    const workingHours = await prisma.workinghours.findMany({
      where: { state: "ACTIVE" },
      include: {
        appointment: {
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
    const groupedByDate = workingHours.reduce((acc: any, curr) => {
      const date = toLocalISOString(curr.date);

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(curr);
      return acc;
    }, {});

    // Process each grouped day
    for (const [date, hours] of Object.entries(groupedByDate)) {
      let hasAvailable = false;
      let hasNoPayment = false;

      for (const hour of hours as any) {
        const appointment = hour.appointment;

        if (!appointment) {
          hasAvailable = true;
        } else {
          const payment = appointment.payment;
          if (!payment || (payment.payed <= 0 && !payment.recite_path)) {
            hasNoPayment = true;
          }
        }

        // If both flags are already true, no need to check further
        if (hasAvailable && hasNoPayment) {
          break;
        }
      }

      if (hasAvailable) {
        availableDays.push({ day: date, workingHoursInstances: hours });
      } else if (hasNoPayment) {
        filledNoPaymentDays.push({ day: date, workingHoursInstances: hours });
      } else {
        filledDays.push({ day: date, workingHoursInstances: hours });
      }
    }

    const res = {
      filled_days: filledDays,
      maybe_filled_days: filledNoPaymentDays,
      allowed_days: availableDays,
    };

    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch days status' }), { status: 500 });
  }
};

function toLocalISOString(date: Date) {
  const pad = (num: any) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}
