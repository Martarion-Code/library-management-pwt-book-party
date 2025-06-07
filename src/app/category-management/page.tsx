"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/database";
import CategoryList from "@/components/categories/CategoryList";
import CategoryFormDialog from "@/components/categories/CategoryFormDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const { toast } = useToast();
  const { user, loading: userLoading } = useAuth();
  const router = useRouter();
  const fetchCategories = async () => {
    try {
      if (!user) {
        // router.push("/login");
        return;
      } else if (user?.role !== "admin") {
        // router.push("/dashboard");
        return;
      }
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      await fetchCategories();
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleSuccess = () => {
    fetchCategories();
    handleDialogClose();
  };

  return (
    <div className="container mx-auto py-8">
      {user && user.role == "admin" ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Category Management</h1>
            <Button onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
          <CategoryList
            categories={categories}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />

          <CategoryFormDialog
            open={isDialogOpen}
            category={selectedCategory}
            onClose={handleDialogClose}
            onSuccess={handleSuccess}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
