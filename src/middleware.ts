import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"



const allowedOrigins = ["https://aiic.djidax.com" , "http://localhost:3000"]
const nullconfig = {
    status: 400,
    statusText: "Bad Request",
    headers: {
        'Content-Type': 'text/plain'
    }
}

export async function middleware(request: NextRequest, event:any) {

    const origin = request.nextUrl.origin
    console.log({origin})
    if (!origin || !allowedOrigins.includes(origin)) {
        return new NextResponse(null, nullconfig)
        
    }
    if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
        withAuth( function middleware(req) {},
            {
              callbacks: {
                authorized: ({ token }) => token?.isAdmin as boolean,
              },
            }
          )
    }


    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
