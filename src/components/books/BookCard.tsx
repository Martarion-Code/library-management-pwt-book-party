// import Image from 'next/image'
// import Link from 'next/link'
// import { Book } from '@/types/book'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
//
// type BookCardProps = {
//     book: Book
// }
//
// export default function BookCard({ book }: BookCardProps) {
//     return (
//         <Card className="h-full flex flex-col">
//             <CardHeader>
//                 <CardTitle className="line-clamp-2">{book.title}</CardTitle>
//             </CardHeader>
//             <CardContent className="flex-grow">
//                 <div className="aspect-w-2 aspect-h-3 mb-4">
//                     <Image
//                         src={book.cover_image || '/placeholder.svg'}
//                         alt={book.title}
//                         layout="fill"
//                         objectFit="cover"
//                         className="rounded-md"
//                     />
//                 </div>
//                 <p className="text-sm text-muted-foreground mb-2">By {book.author}</p>
//                 <Badge variant={book.available ? 'default' : 'secondary'}>
//                     {book.available ? 'Available' : 'Unavailable'}
//                 </Badge>
//             </CardContent>
//             <CardFooter>
//                 <Button asChild variant="outline" className="w-full">
//                     <Link href={`/books/${book.id}`}>View Details</Link>
//                 </Button>
//             </CardFooter>
//         </Card>
//     )
// }



// import Image from 'next/image'
// import Link from 'next/link'
// import { Book } from '@/types/book'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
//
// type BookCardProps = {
//     book: Book
// }
//
// export default function BookCard({ book }: BookCardProps) {
//     return (
//         <Card className="h-full flex flex-col">
//             <CardHeader>
//                 <CardTitle className="line-clamp-2">{book.title}</CardTitle>
//             </CardHeader>
//             <CardContent className="flex-grow">
//                 <div className="relative aspect-[2/3] w-full mb-4">
//                     <Image
//                         src={book.cover_image || '/images/placeholder.jpg'} // 确保存在placeholder图片
//                         alt={book.title}
//                         fill
//                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                         className="rounded-md object-cover"
//                         priority={false}
//                     />
//                 </div>
//                 <p className="text-sm text-muted-foreground mb-2">By {book.author}</p>
//                 <Badge variant={book.available ? 'default' : 'secondary'}>
//                     {book.available ? 'Available' : 'Unavailable'}
//                 </Badge>
//             </CardContent>
//             <CardFooter>
//                 <Button asChild variant="outline" className="w-full">
//                     <Link href={`/books/${book.book_id}`}>View Details</Link>
//                 </Button>
//             </CardFooter>
//         </Card>
//     )
// }



import Image from 'next/image'
import Link from 'next/link'
import { Book } from '@/types/book'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type BookCardProps = {
    book: Book
}

export default function BookCard({ book }: BookCardProps) {
    return (
        <Card className="h-full flex flex-col overflow-hidden card-hover">
            <div className="relative aspect-[3/4] w-full">
                <Image
                    src={book.cover_image_url || '/images/placeholder.jpg'}
                    alt={book.title}
                    fill
                    className="object-cover transition-all hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2">
                    <Badge variant={book.available_copies > 0 ? 'success' : 'secondary'}>
                        {book.available_copies > 0 ? `${book.available_copies} Available` : 'Borrowed'}
                    </Badge>
                </div>
            </div>
            <CardContent className="flex-grow p-4">
                <h3 className="font-semibold text-lg line-clamp-1 mb-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {book.description || 'No description available'}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button asChild variant="outline" className="w-full">
                    <Link href={`/books/${book.book_id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
