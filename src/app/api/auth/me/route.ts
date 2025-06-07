import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

export async function GET() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token');
    console.log("authToken", authToken)
    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET); // Convert secret to Uint8Array for jose

    const decoded = jwtVerify(
      authToken.value,
      secretKey,
      {
        algorithms: ['HS256'] // Specify the algorithm used for signing (must match sign algorithm)
      }
    )
    const awaitedDecoded = await decoded
    console.log(awaitedDecoded)
    const user = await prisma.user.findUnique({
      where: { email: awaitedDecoded?.payload?.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching user' },
      { status: 500 }
    );
  }
}
