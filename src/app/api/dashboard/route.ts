// src/app/api/dashboard/stats/route.ts
import { LibraryService } from '@/lib/library-service';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Call the service method to get dashboard stats
    const dashboardStats = await LibraryService.getDashboardStats(userId);

    const statsToReturn = {
      totalbooks: dashboardStats.totalbooks,
      borrowedbooks: dashboardStats.borrowedbooks,
      overduebooks: dashboardStats.overduebooks,
    };

    return NextResponse.json(statsToReturn, { status: 200 });
  } catch (error: any) {
    // Determine a safe error message and details
    let errorMessage = 'An unknown server error occurred.';
    let errorDetails = 'No specific error message available.';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
      errorDetails = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as any).message;
      errorDetails = (error as any).stack || (error as any).message;
    }

    // Log the error for server-side debugging
    console.error('Error fetching dashboard stats (API Route):', errorMessage, '\nDetails:', errorDetails);

    // Return a structured JSON response to the client
    return NextResponse.json(
      {
        message: 'Failed to fetch dashboard stats',
        error: errorMessage,
        details: errorDetails, // Optionally send more details for debugging in development
      },
      { status: 500 }
    );
  }
}
