import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const cookiesStore = await cookies();
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log(user)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Since we're migrating from Supabase, we'll need to handle password verification
    // differently based on whether it's a new Prisma user or migrated Supabase user
    const passwordMatch = await compare(password, user.password || '');

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('env', process.env.NEXTAUTH_SECRET)
    // Create a JWT token
    // const token = sign(
    //   { userId: user.id, email: user.email, role: user.role },
    //   process.env.NEXTAUTH_SECRET,
    //   { expiresIn: '7d' }
    // );
    const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET); // Convert secret to Uint8Array for jose


    const token = await new SignJWT({
      userId: user.user_id, // Use user.user_id
      email: user.email,
      role: user.membership_type, // Use user.membership_type
    })
      .setProtectedHeader({ alg: 'HS256' }) // Specify the algorithm (e.g., HS256)
      .setIssuedAt()
      .setExpirationTime('7d') // Set expiration to 7 days
      .sign(secretKey);
    console.log('token', token)
    // Set the token in a secure HTTP-only cookie
    cookiesStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
