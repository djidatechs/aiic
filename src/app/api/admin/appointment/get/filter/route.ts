import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient  } from '@prisma/client';
import { appointment_commun_schema, appointment_get_filter_schema, client_commun_schem, payment_commun_schem } from '@/lib/validator';
import { addFilters, constructFilter, parseSearchParams } from '@/lib/functions';


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
    
    addFilters(where, validatedParams?.data?.payment, payment_commun_schem , 'payment');
    addFilters(where, validatedParams?.data, appointment_commun_schema);
    addFilters(where, validatedParams?.data?.client, client_commun_schem, 'client')

    let select: any;
  
    if (validatedParams.data?.select) 
      select = Object.fromEntries(Object.entries(validatedParams.data?.select).map(([key, value]) => [key, value]))    
    else {
      select = {payment:{select:{}},client : {select:{}} }
       Object.keys(prisma.appointment.fields).map(field=>select[field] = true)
       Object.keys(prisma.payment.fields).map(field=>select["payment"]["select"][field] = true)
       Object.keys(prisma.client.fields).map(field=>select["client"]["select"][field] = true)
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

