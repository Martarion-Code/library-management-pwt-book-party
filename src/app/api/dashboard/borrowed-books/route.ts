// src/app/api/dashboard/borrowed-books/route.ts
import { LibraryService } from '@/lib/library-service';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Call the service method to get dashboard stats, which includes borrowedBooksDetails
    const dashboardStats = await LibraryService.getDashboardStats(userId);
    console.log('dashboardStats:', dashboardStats);
    // Return only the borrowedBooksDetails portion
    return NextResponse.json(dashboardStats.borrowedBooksDetails, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching borrowed books:', error);
    return NextResponse.json({ message: 'Failed to fetch borrowed books', error: error.message }, { status: 500 });
  }
}
