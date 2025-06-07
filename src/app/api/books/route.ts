import { LibraryService } from '@/lib/library-service';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('category') || undefined;

    const result = await LibraryService.getBooks({
      page,
      limit,
      search,
      categoryId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Error fetching books' }, { status: 500 });
  }
}

export async function POST(request: Request) {


  try {
    const data = await request.json();
    const book = await LibraryService.createBook({
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      categoryId: data.categoryId,
      description: data.description,
      coverImageUrl: data.cover_image_url,
      totalCopies: parseInt(data.total_copies),
      availableCopies: parseInt(data.available_copies),
    });
    return NextResponse.json(book);
  } catch (error: any) {
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
    
    console.error('Error updating loan (API Route, Catch Block):', errorMessage, '\nDetails:', errorDetails);

    if (errorMessage.includes('Loan not found')) {
      errorMessage = 'The specified loan was not found.';
    } else if (errorMessage.includes('already been returned')) {
      // Use the exact error message from the service layer
    } else if (errorMessage.includes('JSON parsing error')) {
      errorMessage = 'Malformed request body. Please ensure valid JSON is sent.';
    }

    return NextResponse.json(
      {
        message: 'Failed to update loan.',
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}


