"use client";

import { toast, useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { Book } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "../ui/image-upload";
import { v4 as uuidv4 } from "uuid";
import { Textarea } from "../ui/textarea";

interface BookFormDialogProps {
  open: boolean;
  book: Book | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookFormDialog({
  open,
  book,
  onClose,
  onSuccess,
}: BookFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category_id: "",
    description: "",
    cover_image_url: "",
    total_copies: "",
    available_copies: "",
  });
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    console.log('book', book)
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category_id: book.categoryId,
        description: book.description || "",
        cover_image_url: book.coverImageUrl || "",
        total_copies: book.totalCopies || 0,
        available_copies: book.availableCopies || 0,
      });
    } else {
      setFormData({
        title: "",
        author: "",
        isbn: "",
        category_id: "",
        description: "",
        cover_image_url: "",
        total_copies: 0,
        available_copies: 0,
      });
    }
  }, [book]);





   const handleImageUpload = async (file: File) => {
    setIsSubmitting(true); // Indicate loading for image upload
    try {
      const form = new FormData();
      form.append('file', file); // Append the file
      
      // Send the file to your new API route
      const response = await fetch(`/api/upload-image?filename=${uuidv4()}-${file.name}`, {
        method: 'POST',
        body: file, // Send the file directly as body
        // No Content-Type header needed for file uploads, browser sets it
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Image upload failed.');
      }

      const { url } = await response.json();
      setFormData((prev) => ({
        ...prev,
        cover_image_url: url, // Update with the Vercel Blob URL
      }));
      toast({ title: 'Success', description: 'Image uploaded successfully!' });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({ title: 'Error', description: `Image upload failed: ${error instanceof Error ? error.message : 'An unexpected error occurred'}` });
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data) {
        setCategories(
          data.map((cat: any) => ({
            label: cat.name,
            value: cat.id
          }))
        );
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (book) {
        const response = await fetch(`/api/books/${book.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            categoryId: formData.category_id
          }),
        });
        if (!response.ok) throw new Error('Failed to update book');
      } else {
        const response = await fetch('/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            categoryId: formData.category_id
          }),
        });
        if (!response.ok) throw new Error('Failed to create book');
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl md:text-2xl">
            {book ? "Edit Book" : "Add New Book"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select
                value={String(formData.category_id)}
                onValueChange={(value) =>
                  setFormData({ ...formData, category_id: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.value}
                      value={String(category.value)}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full resize-vertical"
              placeholder="Enter book description..."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_copies">Total Copies</Label>
              <Input
                type="number"
                id="total_copies"
                value={formData.total_copies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_copies: Number(e.target.value),
                  })
                }
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available_copies">Available Copies</Label>
              <Input
                type="number"
                id="available_copies"
                value={formData.available_copies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    available_copies: Number(e.target.value),
                  })
                }
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 space-y-2">
              <Label>Cover Image</Label>
              <ImageUpload
                value={formData.cover_image_url}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    cover_image_url: value,
                  })
                }
                onUpload={handleImageUpload}
                disabled={isSubmitting}
              />
            </div>
            <Input
              type="hidden"
              id="cover_image_url"
              value={formData.cover_image_url}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cover_image_url: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : book ? "Update Book" : "Add Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
