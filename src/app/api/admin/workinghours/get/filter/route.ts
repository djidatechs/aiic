import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { workinghoursAdvancedGetFilterSchema, workinghoursSchema } from '@/lib/validator';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const queryParams = req.nextUrl.searchParams;
    const params = parseSearchParams(queryParams)
    const validatedParams = workinghoursAdvancedGetFilterSchema.safeParse(params);

    if (!validatedParams.success) {
      console.log({errors: validatedParams.error?.errors.map((err) => err.message) || []})
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        errors: validatedParams.error?.errors.map((err) => err.message) || [],
      }, { status: 400 });
    }
    

    const page = parseInt(validatedParams.data?.page|| '1');
    const limit = parseInt(validatedParams.data?.limit || '10');
    const skip = (page - 1) * limit;

    let where: any ;

    const constructFilter = (fieldName: string, value: any) => {
      if (value.exact !== undefined) {
        where[fieldName] = value.exact;
      } else {
        where[fieldName] = {};
        if (value.min !== undefined) where[fieldName]['gte'] = value.min;
        if (value.max !== undefined) where[fieldName]['lte'] = value.max;
        if (value.in !== undefined) where[fieldName]['in'] = value.in;
      }
    };
  
    if (validatedParams.data?.date) constructFilter('date', validatedParams.data.date);
    if (validatedParams.data?.startTime) constructFilter('startTime', validatedParams.data.startTime);
    if (validatedParams.data?.type) constructFilter('type', validatedParams.data.type);
    if (validatedParams.data?.duration) constructFilter('duration', validatedParams.data.duration);
    if (validatedParams.data?.state) constructFilter('state', validatedParams.data.state);

    let select: any;
  
    if (validatedParams.data?.select) {
      select = Object.fromEntries(
        Object.entries(validatedParams.data?.select).map(([key, value]) => [key, value])
      );
    }

    let orderBy: any;
    if (validatedParams.data?.order) {
      orderBy = [validatedParams.data?.order]
    }

    const workinghours = await prisma.workinghours.findMany({
      where,
      select: select || undefined, // Apply select clause if defined
      orderBy: orderBy || undefined, // Apply order clause if defined
      skip,
      take: limit,
    });

    // Fetch total count for pagination purposes
    const totalCount = await prisma.workinghours.count({ where });

    return NextResponse.json({ 
      success: true, 
      workinghours, 
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

function parseSearchParams(searchParams: URLSearchParams): Record<string, any>|undefined {
  const query: Record<string, any> = {};

  // Function to set values in the result object, handling nested properties
  function setNestedValue(obj: Record<string, any>, keys: string[], value: any) {
      const lastKey = keys.pop()!;
      const lastObj = keys.reduce((obj, key) => 
          obj[key] = obj[key] || {}, 
          obj
      );
      lastObj[lastKey] = value;
  }

  // Process each key-value pair
  for (const [key, value] of searchParams.entries() as any) {
      // Parse the key to handle nested objects
      const keyParts = key.split(/[\[\]]+/).filter(Boolean);

      // Set the value in the resulting object
      setNestedValue(query, keyParts, value === 'true' ? true : value === 'false' ? false : value);
  }

  return Object.keys(query).length ? query : undefined ;
}
