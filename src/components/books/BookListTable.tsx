import { Book } from '@/types/book'
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

interface BookListProps {
    books: Book[]
    isLoading: boolean
    onEdit: (book: Book) => void
    onDelete: (bookId: number) => void
}

export default function BookListTable({
    books,
    isLoading,
    onEdit,
    onDelete,
}: BookListProps) {
    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>ISBN</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {books.map((book) => (
                    <TableRow key={book.book_id}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.category}</TableCell>
                        <TableCell>{book.isbn}</TableCell>
                        <TableCell className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(book)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(book.book_id)}
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