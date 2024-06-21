import { NextRequest, NextResponse } from 'next/server'; // Import from 'next/server' for the app directory.
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// Handle POST request to create a new appointment
export async function GET(req: NextRequest) {    
    try {
        const link = req.nextUrl.searchParams.get("link")

        if (!link || ! link.length) 
        return NextResponse.json({ success: false, error: "wrong Zlink" }, { status: 500 });


      
        const appointment = await prisma.appointment.findFirst({
          where: {link},
          include: {
            client:{
                select:{
                    firstName : true,
                    lastName : true
                }
            },
            workinghours:{
                select:{
                    date:true,
                    type:true,
                    duration:true
                }
            }
          }
        });

        if (!appointment) 
        return NextResponse.json({ success: false, error: "wrong Zlink" }, { status: 500 });
        
        return NextResponse.json({ success: true, appointment });
    } catch (error) {
                console.error("Error creating appointment:", error);
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}
