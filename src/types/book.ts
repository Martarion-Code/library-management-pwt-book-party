export type Book = {
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
    category?: {
        id: string;
        name: string;
    };
};
