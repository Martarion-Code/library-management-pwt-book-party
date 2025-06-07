// src/app/api/loans/[id]/route.ts
import { LibraryService } from '@/lib/library-service';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const {id:loanId} = await params;

  let requestBody: any = {}; // Initialize as an empty object
  const contentType = request.headers.get('content-type');
  const contentLength = request.headers.get('content-length');

  try {
    // Only attempt to parse JSON body if content-type is application/json
    // and content-length indicates there's actually a body.
    if (request.method === 'PUT' || request.method === 'POST' || request.method === 'PATCH') {
        if (contentType?.includes('application/json') && contentLength && parseInt(contentLength, 10) > 0) {
            try {
                requestBody = await request.json();
                console.log('API Route - Received JSON body:', requestBody);
            } catch (jsonParseError: any) {
                console.error('API Route - JSON parsing error:', jsonParseError.message);
                return NextResponse.json(
                    {
                        message: 'Malformed request body. Please ensure valid JSON is sent.',
                        error: 'JSON_PARSE_ERROR',
                        details: jsonParseError.message,
                    },
                    { status: 400 } // Bad Request due to invalid JSON
                );
            }
        } else {
            console.log('API Route - No JSON body expected or provided. Content-Type:', contentType, 'Content-Length:', contentLength);
            // If it's a PUT but no body, it's still a client error for this specific API.
            // But we don't throw "Unexpected end of JSON input".
        }
    } else {
        console.log('API Route - Request method is not PUT/POST/PATCH, skipping body parsing.');
    }


    // Validate the parsed body data
    

    // Call the service method to return the loan
    // The service method (returnLoan) itself doesn't need `status` or `returnedAt` from the API route's body,
    // as it sets them internally.
    await LibraryService.returnLoan(loanId);

    return NextResponse.json({ message: 'Loan updated successfully!' }, { status: 200 });
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
