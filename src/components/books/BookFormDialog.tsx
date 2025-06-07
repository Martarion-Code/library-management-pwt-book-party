"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { supabase } from "@/lib/supabase-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category_id: book.category_id,
        description: book.description || "",
        cover_image_url: book.cover_image_url || "",
        total_copies: book.total_copies || 0,
        available_copies: book.available_copies || 0,
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
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `book-covers/${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        cover_image_url: publicUrl,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("name, category_id")
        .order("name");
      if (!error && data) {
        console.log(data);
        setCategories(
          data.map((cat) => {
            return { label: cat.name, value: cat.category_id };
          })
        );
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Updating book:");
      if (book) {
        const { error } = await supabase
          .from("books")
          .update(formData)
          .eq("book_id", book.book_id);
        if (error) throw error;
      } else {
        
        const { error } = await supabase
          .from("books")
          .insert({ ...formData, category_id: Number(formData.category_id) });
          console.log('aa', error)
        if (error) throw error;
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
