import { Category } from '@/types/database';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface CategoryListProps {
    categories: (Category & { _count?: { books: number } })[]
    isLoading: boolean
    onEdit: (category: Category) => void
    onDelete: (id: string) => void
}

export default function CategoryList({
    categories,
    isLoading,
    onEdit,
    onDelete,
}: CategoryListProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Books Count</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((category) => (
                    <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category._count?.books || 0}</TableCell>
                        <TableCell className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(category)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(category.id)}
                                className="text-red-500 hover:text-red-600"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}