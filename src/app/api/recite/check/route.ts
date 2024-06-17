import { NextRequest, NextResponse } from 'next/server'; // Import from 'next/server' for the app directory.
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// Handle POST request to create a new appointment
export async function GET(req: NextRequest) {    
    try {
        const link = req.nextUrl.searchParams.get("link")

        if (!link?.length) 
        return NextResponse.json({ success: false, error: "wrong link" }, { status: 500 });
      
        
        const response = await prisma.payment.findFirst({
            where : {
                appointment :{
                    link:link
                }
            },
            select : {
                recite_path : true
            }
        })

        if (response===null) 
        return NextResponse.json({ success: false, error: "wrong link" }, { status: 500 });

        
        return NextResponse.json({ success: true, uploaded : response.recite_path!==null });

    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}
