// src/app/api/upload-image/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!request.body || !filename) {
    return NextResponse.json({ message: 'No file or filename provided.' }, { status: 400 });
  }

  try {
    // put function uploads the file to Vercel Blob storage
    // It returns an object containing the URL of the uploaded file.
    const blob = await put(filename, request.body, {
      access: 'public', // Makes the uploaded file publicly accessible
    });

    // Return the URL of the uploaded image
    return NextResponse.json({ url: blob.url });
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
