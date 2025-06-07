"use client";

import { useState, useEffect } from "react";
import { Book } from "@/types/database";
import BookListTable from "@/components/books/BookListTable";
import BookFormDialog from "@/components/books/BookFormDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function BookManagementPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { toast } = useToast();
  const { user, loading: userLoading } = useAuth();
  const router = useRouter();

  const fetchBooks = async () => {
    console.log("user", user)
    try {
      if (!user) {
        // router.push("/login");
        return;
      } else if (user?.role !== "admin") {
        // router.push("/dashboard");
        return;
      }
      const response = await fetch("/api/books");
      const data = await response.json();
      setBooks(data.books || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [user]);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.push("/login");
      return;
    } else if (user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
  }, [user, userLoading]);

  const handleAddClick = () => {
    setSelectedBook(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      await fetchBooks();
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedBook(null);
  };

  const handleSuccess = () => {
    fetchBooks();
    handleDialogClose();
  };

  return (
    <div className="container mx-auto py-8">
      {user && user?.role == "admin" ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Book Management</h1>
            <Button onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </div>

          <BookListTable
            books={books}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />

          <BookFormDialog
            open={isDialogOpen}
            book={selectedBook}
            onClose={handleDialogClose}
            onSuccess={handleSuccess}
          />
        </>
      ) : (
        <div className="text-center">
          {/* <h1 className="text-3xl font-bold">Please login to access this page</h1>
          <Link href="/login">
            <a className="text-blue-500 hover:underline">Login</a>
          </Link> */}
        </div>
      )}
    </div>
  );
}
