import { Book } from '@/types/database'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '../ui/badge'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardContent className="pt-4">
          <div className="aspect-[2/3] relative mb-4">
            {book.coverImageUrl ? (
              <Image
                src={book.coverImageUrl}
                alt={book.title}
                fill
                className="object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center rounded-md">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>
          <h3 className="font-semibold line-clamp-2 mb-1">{book.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
          {book.category && (
            <Badge variant="secondary" className="mb-2">
              {book.category.name}
            </Badge>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            {book.availableCopies} of {book.totalCopies} available
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
