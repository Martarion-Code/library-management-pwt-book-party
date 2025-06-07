"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase-client";
import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BookListTable from "@/components/books/BookListTable";
import BookFormDialog from "@/components/books/BookFormDialog";

export default function AdminBookPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("title", { ascending: true });

      if (error) throw error;
      if (Array.isArray(data)) {
        setBooks(data as Book[]);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleAddBook = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDeleteBook = async (bookId: number) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    const { data, error } = await supabase
      .from("loans") // Ganti sesuai nama tabel peminjaman kamu
      .select("loan_id")
      .eq("book_id", bookId)
      .eq("status", "borrowed") // Misal: status = "borrowed" menandakan masih dipinjam
      .maybeSingle();

    if (error) {
      console.error("Error checking borrowing status:", error);
      setWarningMessage("Terjadi kesalahan saat mengecek status peminjaman.");
      setWarningDialogOpen(true);
      return;
    }

    if (data) {
      // Masih dipinjam
      setWarningMessage("Buku ini masih dipinjam dan tidak bisa dihapus.");
      setWarningDialogOpen(true);
    } else {
      // Aman untuk dihapus
       // onDelete(bookId);
      try {
        const { error } = await supabase
          .from("books")
          .delete()
          .eq("book_id", bookId);
  
        if (error) throw error;
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Books</h1>
        <Button onClick={handleAddBook}>
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      <BookListTable
        books={books}
        isLoading={isLoading}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
      />

      <BookFormDialog
        open={isFormOpen}
        book={editingBook}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchBooks();
        }}
      />
      
    </div>
  );
}
