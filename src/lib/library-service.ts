import { prisma } from './prisma';
import type { Book, Category, User } from '@prisma/client';

export class LibraryService {
  // Book operations
  static async getBooks(params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
  }) {
    const { page = 1, limit = 10, search, categoryId } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
          { isbn: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(categoryId && { categoryId }),
    };

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: {
          title: 'asc',
        },
      }),
      prisma.book.count({ where }),
    ]);

    return {
      books,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  static async getBookById(id: string) {
    return prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  static async createBook(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.book.create({
      data,
      include: {
        category: true,
      },
    });
  }

  static async updateBook(id: string, data: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>) {
    return prisma.book.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  static async deleteBook(id: string) {
    return prisma.book.delete({
      where: { id },
    });
  }

  // Category operations
  static async getCategories() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { books: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  static async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        books: true,
        _count: {
          select: { books: true },
        },
      },
    });
  }

  static async createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.category.create({
      data,
    });
  }

  static async updateCategory(id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }

  // User operations
  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.user.create({
      data,
    });
  }

  // Dashboard statistics
 

  
  // Loan operations
  static async createLoan(data: { userId: string; bookId: string; dueDate: Date }) {
    return prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { id: data.bookId },
      });

      if (!book) {
        throw new Error('Book not found.');
      }
      if (book.availableCopies <= 0) {
        throw new Error('No copies available for borrowing.');
      }

      const user = await tx.user.findUnique({
        where: { id: data.userId },
      });
      if (!user) {
        throw new Error('User not found.');
      }

      const newLoan = await tx.loan.create({ // Use 'Loan' model
        data: {
          userId: data.userId,
          bookId: data.bookId,
          status: 'BORROWED', // Set default status
          borrowedAt: new Date(),
          dueDate: data.dueDate
        },
      });

      await tx.book.update({
        where: { id: data.bookId },
        data: {
          availableCopies: { decrement: 1 },
        },
      });
      return newLoan;
    });
  }

  static async returnLoan(loanId: string) {
    
    return prisma.$transaction(async (tx) => {
      const loan = await tx.loans.findUnique({ // Use 'Loan' model
        where: { loan_id: loanId },
        select: { loan_id: true, book_id: true, status: true },
      });
      console.log('loan', loan)
      if (!loan) {
        throw new Error('Loan not found.');
      }
      if (loan.status === 'RETURNED') {
        throw new Error('This book has already been returned.');
      }

      await tx.loans.update({ // Use 'Loan' model
        where: { loan_id: loanId },
        data: {
          status: 'RETURNED', // Update status to RETURNED
          returned_at: new Date(),
        },
      });

      if (loan.book_id) {
        await tx.book.update({
          where: { id: loan.book_id },
          data: {
            availableCopies: { increment: 1 },
          },
        });
      }
    });
  }

  // Reservation operations
  static async createReservation(data: { userId: string; bookId: string; reservedAt: Date }) {
    return prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { id: data.bookId },
      });

      if (!book) {
        throw new Error('Book not found.');
      }
      if (book.availableCopies > 0) {
        throw new Error('This book is currently available and does not require a reservation.');
      }

      const user = await tx.user.findUnique({
        where: { id: data.userId },
      });
      if (!user) {
        throw new Error('User not found.');
      }

      const existingReservation = await tx.reservation.findFirst({ // Use 'Reservation' model
        where: {
          userId: user.id,
          bookId: book.id,
          status: 'PENDING', // Assuming 'PENDING' is the active status for reservations
        },
      });

      if (existingReservation) {
        throw new Error('You already have an active reservation for this book.');
      }

      const newReservation = await tx.reservation.create({ // Use 'Reservation' model
        data: {
          userId: user.id,
          bookId: book.id,
          reservedAt: data.reservedAt,
          status: 'PENDING',
        },
      });
      return newReservation;
    });
  }


  // Dashboard statistics
  static async getDashboardStats(userId: string) {
    console.log('ohohoooh')
    const [totalBooks, borrowedCount, overdueCount] = await prisma.$transaction([
      prisma.book.count(),
      prisma.loans.count({ // Use 'Loan' model
        where: {
          user_id: userId,
          status: 'BORROWED',
        },
      }),
      prisma.loans.count({ // Use 'Loan' model
        where: {
          user_id: userId,
          status: 'BORROWED',
          due_date: {
            lt: new Date(),
          },
        },
      }),
    ]);
    
    console.log('totalbooks', totalBooks)
    const borrowedBooksDetails = await prisma.loans.findMany({ // Use 'Loan' model
      where: {
        user_id: userId,
        status: 'BORROWED',
      },
      select: {
        loan_id: true,
        due_date:true,
        book: {
          select: {
            id:true,
            title: true,
            author: true,
            coverImageUrl: true,
          },
        },
      },
      orderBy: {
        due_date: 'asc',
      },
    });
    console.log('borrwedBooksDetails', borrowedBooksDetails)
    return {
      totalbooks: totalBooks,
      borrowedbooks: borrowedCount,
      overduebooks: overdueCount,
      borrowedBooksDetails: borrowedBooksDetails.map(loan => ({
        id: loan.loan_id,
        title: loan.book?.title || 'Unknown Title',
        author: loan.book?.author || 'Unknown Author',
        due_date: loan.due_date ? loan.due_date?.toISOString() :  Date(),
        cover_image: loan.book?.coverImageUrl ?? null,
      })),
    };
  }
}

