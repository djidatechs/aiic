import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient  } from '@prisma/client';
import { workinghours_get_filter_schema } from '@/lib/validator';
import { constructFilter, parseSearchParams } from '@/lib/functions';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const queryParams = req.nextUrl.searchParams;
    const params = parseSearchParams(queryParams)
    console.log(params)
    const validatedParams = workinghours_get_filter_schema.safeParse(params);
    if (!validatedParams.success) {
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
    if (validatedParams.data?.appointment?.id) constructFilter(where,'appointment.id', validatedParams.data.appointment.id );
    if (validatedParams.data?.date) constructFilter(where,'date', validatedParams.data.date);
    if (validatedParams.data?.type) constructFilter(where,'type', validatedParams.data.type);
    if (validatedParams.data?.duration) constructFilter(where,'duration', validatedParams.data.duration);
    if (validatedParams.data?.state) constructFilter(where,'state', validatedParams.data.state)
    let select: any;
  
    if (validatedParams.data?.select) 
      select = Object.fromEntries(Object.entries(validatedParams.data?.select).map(([key, value]) => [key, value]))    
    else {
      select = {appointment:{select:{id:true}}}
       Object.keys(prisma.workinghours.fields).map(field=>select[field] = true)
      //  Object.keys(prisma.payment.fields).map(field=>select["appointment"]["select"][field] = true)
      }

    let orderBy: any;
    if (validatedParams.data?.order) {
      const orders = validatedParams.data?.order
      orderBy = Object.keys(orders).map((key)=>({[key]:orders[key]}))
      // orderBy = [validatedParams.data?.order]
    }

    
    const res_workinghours = await prisma.workinghours.findMany({
        where,
        select: select || undefined,
        orderBy: orderBy || undefined, // Apply order clause if defined
        skip,
        take: limit,
  
      });

    // Fetch total count for pagination purposes
    const totalCount = await prisma.workinghours.count({ where });


    return NextResponse.json({ 
      success: true, 
      data:res_workinghours, 
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching workinghours:", error);
    return NextResponse.json({ success: false, error: error || 'Internal server error' }, { status: 500 });
  }
}

