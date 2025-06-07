'use client'

import { useState, useEffect } from 'react'
import { Category } from '@/types/category'
import { supabase } from '@/lib/supabase-client'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface CategoryFormDialogProps {
    open: boolean
    category: Category | null
    onClose: () => void
    onSuccess: () => void
}

export default function CategoryFormDialog({
    open,
    category,
    onClose,
    onSuccess,
}: CategoryFormDialogProps) {
    const [name, setName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        if (category) {
            setName(category.name)
        } else {
            setName('')
        }
    }, [category])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (category) {
                const { error } = await supabase
                    .from('categories')
                    .update({ name })
                    .eq('category_id', category.category_id)

                if (error) throw error
            } else {
                const { error } = await supabase.from('categories').insert({ name })
                if (error) throw error
            }

            toast({
                title: 'Success',
                description: category
                    ? 'Category updated successfully'
                    : 'Category created successfully',
            })
            onSuccess()
        } catch (error) {
            console.error('Error saving category:', error)
            toast({
                title: 'Error',
                description: 'Failed to save category',
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {category ? 'Edit Category' : 'Add New Category'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? 'Saving...'
                                : category
                                ? 'Update Category'
                                : 'Add Category'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}