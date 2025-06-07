import { Category } from '@/types/category'
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

interface CategoryListTableProps {
    categories: Category[]
    isLoading: boolean
    onEdit: (category: Category) => void
    onDelete: (categoryId: number) => void
}

export default function CategoryListTable({
    categories,
    isLoading,
    onEdit,
    onDelete,
}: CategoryListTableProps) {
    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((category) => (
                    <TableRow key={category.category_id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>
                            {new Date(category.created_at!).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="space-x-2 flex items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(category)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(category.category_id)}
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