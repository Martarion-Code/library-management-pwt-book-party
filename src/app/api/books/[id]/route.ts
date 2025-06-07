import { LibraryService } from '@/lib/library-service';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const book = await LibraryService.getBookById(params.id);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Error fetching book' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const book = await LibraryService.updateBook(params.id, {
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





export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await LibraryService.deleteBook(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Error deleting book' }, { status: 500 });
  }
}
