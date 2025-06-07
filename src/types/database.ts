export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    books: number;
  };
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  categoryId: string;
  description: string | null;
  coverImageUrl: string | null;
  totalCopies: number;
  availableCopies: number;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
