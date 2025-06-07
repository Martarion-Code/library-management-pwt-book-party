"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function BookPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isReserving, setIsReserving] = useState(false);

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${params.id}`);
      if (!response.ok) {
        throw new Error("Book not found");
      }
      const data = await response.json();
      setBook(data);
    } catch (error) {
      console.error("Error fetching book:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  // Borrow book handler
  const handleBorrow = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to borrow books.",
        variant: "destructive",
      });
      return;
    }
    setIsBorrowing(true);
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 2 weeks loan
      const response = await fetch(`/api/books/${params.id}/borrows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, dueDate }),
      });
      const awaited = await response.json();
      console.log("response", awaited);
      if (!response.ok) {
        toast({
          title: "Error",
          description: awaited?.message || "Could not borrow book",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Success", description: "Book borrowed successfully!" });
      // Optionally refetch book data
      setBook(
        (prev) => prev && { ...prev, availableCopies: prev.availableCopies - 1 }
      );
    } finally {
      setIsBorrowing(false);
    }
  };

  // Reserve book handler
  const handleReserve = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to reserve books.",
        variant: "destructive",
      });
      return;
    }
    setIsReserving(true);
    try {
      const response = await fetch(`/api/books/${params.id}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!response.ok) throw new Error("Failed to reserve book");
      toast({ title: "Success", description: "Book reserved successfully!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not reserve book",
        variant: "destructive",
      });
    } finally {
      setIsReserving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-[2/3] w-full max-w-md mx-auto" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return <div className="container mx-auto py-8">Book not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-[2/3] w-full max-w-md mx-auto">
          {book.coverImageUrl ? (
            <Image
              src={book.coverImageUrl}
              alt={book.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-xl text-muted-foreground">by {book.author}</p>

          <div className="flex items-center gap-2">
            {book.category && <Badge>{book.category.name}</Badge>}
            <Badge variant="outline">ISBN: {book.isbn}</Badge>
          </div>

          <div className="prose dark:prose-invert">
            <p>{book.description}</p>
          </div>

          <div className="pt-4 border-t">
            <p className="text-lg">
              {book.availableCopies} of {book.totalCopies} copies available
            </p>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleBorrow}
                disabled={isBorrowing || !user || book.availableCopies < 1}
              >
                {isBorrowing ? "Borrowing..." : "Borrow"}
              </Button>
              {/* <Button
                onClick={handleReserve}
                disabled={isReserving || !user}
                variant="outline"
              >
                {isReserving ? "Reserving..." : "Reserve"}
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
