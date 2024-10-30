import Image from 'next/image'
import Link from 'next/link'
import { Book } from '@/types/book'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type BookCardProps = {
    book: Book
}

export default function BookCard({ book }: BookCardProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="line-clamp-2">{book.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="aspect-w-2 aspect-h-3 mb-4">
                    <Image
                        src={book.cover_image || '/placeholder.svg'}
                        alt={book.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                    />
                </div>
                <p className="text-sm text-muted-foreground mb-2">By {book.author}</p>
                <Badge variant={book.available ? 'default' : 'secondary'}>
                    {book.available ? 'Available' : 'Unavailable'}
                </Badge>
            </CardContent>
            <CardFooter>
                <Button asChild variant="outline" className="w-full">
                    <Link href={`/books/${book.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
