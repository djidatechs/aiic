import { NextRequest, NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

const allowedOrigins = ["https://aiic.djidax.com", "http://localhost:3000"];
const nullconfig = {
  status: 400,
  statusText: "Bad Request",
  headers: {
    'Content-Type': 'text/plain',
  },
};

async function generalMiddleware(request: NextRequest) {

  const origin = request.nextUrl.origin;


  if (!origin || !allowedOrigins.includes(origin)) {
    return new NextResponse(null, nullconfig);
  }

  return NextResponse.next();
}

const adminMiddleware = withAuth(
  async function adminMiddleware(request: NextRequest) {
    // Additional admin-specific logic can go here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.isAdmin as boolean,
    },
    pages: {
        signIn : "/admin/auth",
        signOut : "/admin/auth",
        error : "/admin/auth"
    }
  }
);

export function middleware(request: NextRequestWithAuth,event:any) {
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    return adminMiddleware(request, event );
  }
  return generalMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
