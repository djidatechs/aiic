import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient  } from '@prisma/client';
import { appointment_get_filter_schema } from '@/lib/validator';
import { constructFilter, parseSearchParams } from '@/lib/functions';


const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const queryParams = req.nextUrl.searchParams;
    const params = parseSearchParams(queryParams)
    const validatedParams = appointment_get_filter_schema.safeParse(params);
    
    if (!validatedParams.success) {
      console.log({errors: validatedParams.error})
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        errors: validatedParams.error?.errors.map((err) => err.message) || [],
      }, { status: 400 });
    }
  
    const page = parseInt(validatedParams.data?.page|| '1');
    const limit = parseInt(validatedParams.data?.limit || '10');
    const skip = (page - 1) * limit;

    let where: any = {} ;
    
    if (validatedParams.data?.payment?.id) constructFilter(where,'payment.id', validatedParams.data.payment.id );
    if (validatedParams.data?.payment?.amount) constructFilter(where,'payment.amount', validatedParams.data.payment.amount );
    if (validatedParams.data?.payment?.payed) constructFilter(where,'payment.payed', validatedParams.data.payment.payed);
    if (validatedParams.data?.payment?.updated_At) constructFilter(where,'payment.updated_At', validatedParams.data.payment.updated_At);
    if (validatedParams.data?.payment?.created_At) constructFilter(where,'payment.created_At', validatedParams.data.payment.created_At);
    if (validatedParams.data?.payment?.recite_path) constructFilter(where,'recite_path', validatedParams.data.payment.recite_path)
    if (validatedParams.data?.state) constructFilter(where,'state', validatedParams.data.state)
    if (validatedParams.data?.created_At) constructFilter(where,'created_At', validatedParams.data.created_At)
    if (validatedParams.data?.updated_At) constructFilter(where,'updated_At', validatedParams.data.updated_At)
    if (validatedParams.data?.link) constructFilter(where,'link', validatedParams.data.link)
    if (validatedParams.data?.clientId) constructFilter(where,'clientId', validatedParams.data.clientId)
    if (validatedParams.data?.WorkingHoursId) constructFilter(where,'WorkingHoursId', validatedParams.data?.WorkingHoursId)
    

    let select: any;
  
    if (validatedParams.data?.select) 
      select = Object.fromEntries(Object.entries(validatedParams.data?.select).map(([key, value]) => [key, value]))    
    else {
      select = {payment:{select:{}}}
       Object.keys(prisma.appointment.fields).map(field=>select[field] = true)
       Object.keys(prisma.payment.fields).map(field=>select["payment"]["select"][field] = true)
      }
    

    let orderBy: any;
    if (validatedParams.data?.order) {
      orderBy = [validatedParams.data?.order]
    }
    const res_appointment = await prisma.appointment.findMany({
      where,
      select: select || undefined,
      orderBy: orderBy || undefined, // Apply order clause if defined
      skip,
      take: limit,

    });

    // Fetch total count for pagination purposes
    const totalCount = await prisma.appointment.count({ where });

    return NextResponse.json({ 
      success: true, 
      appointment:res_appointment, 
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json({ success: false, error: error || 'Internal server error' }, { status: 500 });
  }
}

