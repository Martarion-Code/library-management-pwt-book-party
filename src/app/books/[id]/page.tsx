'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase-client'
import { Book } from '@/types/book'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'

export default function BookDetails() {
    const [book, setBook] = useState<Book | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const params = useParams()
    const id = params.id as string

    useEffect(() => {
        fetchBook()
    }, [id])

    const fetchBook = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            setBook(data as Book)
        } catch (error) {
            console.error('Error fetching book:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <Loading />
    }

    if (!book) {
        return <div className="text-center">Book not found</div>
    }

    return (
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{book.title}</CardTitle>
                    <CardDescription>By {book.author}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="aspect-w-2 aspect-h-3 w-full max-w-sm mx-auto">
                        <Image
                            src={book.cover_image || '/placeholder.svg'}
                            alt={book.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <p><strong>ISBN:</strong> {book.isbn}</p>
                        <p><strong>Category:</strong> {book.category}</p>
                        <Badge variant={book.available ? 'default' : 'secondary'}>
                            {book.available ? 'Available' : 'Unavailable'}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">{book.description}</p>
                </CardContent>
                <CardFooter>
                    <Button disabled={!book.available}>
                        {book.available ? 'Borrow Book' : 'Currently Unavailable'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
