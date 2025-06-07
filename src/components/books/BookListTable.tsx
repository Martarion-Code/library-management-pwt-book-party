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
import Image from 'next/image'

interface BookListProps {
    books: Book[]
    isLoading: boolean
    onEdit: (book: Book) => void
    onDelete: (bookId: string) => void
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
    console.log(books)

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Cover</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>ISBN</TableHead>
                    <TableHead>Total Copies</TableHead>
                    <TableHead>Available Copies</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {books.map((book) => (
                    <TableRow key={book.id}>
                        <TableCell>
                            <div className="relative h-16 w-12">
                                {book.coverImageUrl ? (
                                    <Image
                                        src={book.coverImageUrl}
                                        alt={book.title}
                                        fill
                                        className="object-cover rounded-sm"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-muted flex items-center justify-center rounded-sm">
                                        <span className="text-xs text-muted-foreground">
                                            No image
                                        </span>
                                    </div>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.category?.name}</TableCell>
                        <TableCell>{book.isbn}</TableCell>
                        <TableCell>{book.totalCopies}</TableCell>
                        <TableCell>{book.availableCopies}</TableCell>
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
                                onClick={() => onDelete(book.id)}
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