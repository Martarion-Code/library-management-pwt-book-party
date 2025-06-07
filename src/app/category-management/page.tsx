'use client'

import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase-client'
import { Category } from '@/types/category'
import CategoryFormDialog from '@/components/categories/CategoryFormDialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import CategoryListTable from '@/components/categories/CategoryList'

export default function CategoryManagement() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const { toast } = useToast()

    const fetchCategories = useCallback(async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true })

            if (error) throw error
            setCategories(data || [])
        } catch (error) {
            console.error('Error fetching categories:', error)
            toast({
                title: 'Error',
                description: 'Failed to fetch categories',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const handleAddCategory = () => {
        setEditingCategory(null)
        setIsFormOpen(true)
    }

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        setIsFormOpen(true)
    }

    const handleDeleteCategory = async (categoryId: number) => {
        // Check if category is being used by any books
        const { data: books, error: checkError } = await supabase
            .from('books')
            .select('book_id')
            .eq('category_id', categoryId)
            .limit(1)

        if (checkError) {
            toast({
                title: 'Error',
                description: 'Failed to check category usage',
                variant: 'destructive',
            })
            return
        }

        if (books && books.length > 0) {
            toast({
                title: 'Cannot Delete',
                description: 'This category is being used by one or more books',
                variant: 'destructive',
            })
            return
        }

        if (!window.confirm('Are you sure you want to delete this category?')) return

        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('category_id', categoryId)

            if (error) throw error

            toast({
                title: 'Success',
                description: 'Category deleted successfully',
            })
            fetchCategories()
        } catch (error) {
            console.error('Error deleting category:', error)
            toast({
                title: 'Error',
                description: 'Failed to delete category',
                variant: 'destructive',
            })
        }
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Categories</h1>
                <Button onClick={handleAddCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <CategoryListTable
                categories={categories}
                isLoading={isLoading}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
            />

            <CategoryFormDialog
                open={isFormOpen}
                category={editingCategory}
                onClose={() => setIsFormOpen(false)}
                onSuccess={() => {
                    setIsFormOpen(false)
                    fetchCategories()
                }}
            />
        </div>
    )
}