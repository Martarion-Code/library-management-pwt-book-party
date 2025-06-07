// src/app/api/books/[id]/borrow/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const awaitedParams = await params; // The book ID from the URL path
  const bookId = await awaitedParams.id; // The book ID from the URL path

  try {
    const { userId, dueDate } = await request.json();

    if (!userId || !dueDate) {
      return NextResponse.json({ message: 'User ID and Due Date are required.' }, { status: 400 });
    }

    // Use a Prisma transaction to ensure both operations (creating loan and updating book) are atomic
    const loan = await prisma.$transaction(async (tx) => {
      // 1. Find the book and check availability
      const book = await tx.book.findUnique({
        where: { id: bookId },
      });
      
      console.log(' book', book)
      if (!book) {
        throw new Error('Book not found.');
      }


      if (book.availableCopies <= 0) {
        throw new Error('No copies available for borrowing.');
      }
    
      // 2. Verify user exists
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      console.log('user', user)


      if (!user) {
        throw new Error('User not found.');
      }

       // NEW CHECK: Prevent borrowing if the user already has an active loan for this book
      const existingLoan = await tx.loans.findFirst({
        where: {
          user_id: user.id,   // Ensure userId matches your schema's field name (user.id)
          book_id: book.id,   // Ensure bookId matches your schema's field name (book.id)
          status: 'BORROWED', // Check for existing 'BORROWED' status
        },
      });

      if (existingLoan) {
        throw new Error('You have already borrowed a copy of this book.');
      }

      // 3. Create the loan record
      const newLoan = await tx.loans.create({
        data: {
          user_id: user.id, // Use the correct field name from your schema
          book_id: book.id,   // Use the correct field name from your schema
          status: 'BORROWED', // Assuming 'BORROWED' is a valid LoanStatus enum value
          borrowed_at: new Date(), // Set borrowed_at to now
          due_date: new Date(dueDate), // Ensure dueDate is a Date object
        },
      });
      console.log('newLoan', newLoan)

      // 4. Decrement available copies of the book
      await tx.book.update({
        where: { id: bookId },
        data: {
          availableCopies: {
            decrement: 1,
          },
        },
      });

      return newLoan;
    });

    return NextResponse.json({ message: 'Book borrowed successfully!', loan }, { status: 201 });
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
    // Provide specific error messages based on what happened in the try block
    if (error.message.includes('Book not found')) {
      errorMessage = 'The specified book was not found.';
    } else if (error.message.includes('No copies available')) {
      errorMessage = 'This book is currently out of stock.';
    } else if (error.message.includes('User not found')) {
      errorMessage = 'The specified user was not found.';
    }

    return NextResponse.json(
      {
        message: errorMessage,
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}




