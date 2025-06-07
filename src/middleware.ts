import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Import jwtVerify from jose

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token');
  console.log(authToken)
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register'];
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // API routes that require authentication
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      console.log("authtokenvalue", authToken.value)
      console.log("next auth", process.env.NEXTAUTH_SECRET)
      const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET); // Convert secret to Uint8Array for jose

      jwtVerify(authToken.value, secretKey, {
        algorithms: ['HS256'] // Specify the algorithm used for signing (must match sign algorithm)
      });

      return NextResponse.next();
    } catch (error) {
      console.log("error", error)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  // Pages that require authentication
  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET); // Convert secret to Uint8Array for jose

    jwtVerify(authToken.value, secretKey, {
      algorithms: ['HS256'] // Specify the algorithm used for signing (must match sign algorithm)
    }); return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
