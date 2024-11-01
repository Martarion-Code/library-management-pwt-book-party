// 'use client'
//
// import { useState, useEffect } from 'react'
// import { useParams } from 'next/navigation'
// import Image from 'next/image'
// import { supabase } from '@/lib/supabase-client'
// import { Book } from '@/types/book'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Loading } from '@/components/ui/loading'
//
// export default function BookDetails() {
//     const [book, setBook] = useState<Book | null>(null)
//     const [isLoading, setIsLoading] = useState(true)
//     const params = useParams()
//     const id = params.id as string
//
//     useEffect(() => {
//         fetchBook()
//     }, [id])
//
//     const fetchBook = async () => {
//         setIsLoading(true)
//         try {
//             const { data, error } = await supabase
//                 .from('books')
//                 .select('*')
//                 .eq('id', id)
//                 .single()
//
//             if (error) throw error
//
//             setBook(data as Book)
//         } catch (error) {
//             console.error('Error fetching book:', error)
//         } finally {
//             setIsLoading(false)
//         }
//     }
//
//     if (isLoading) {
//         return <Loading />
//     }
//
//     if (!book) {
//         return <div className="text-center">Book not found</div>
//     }
//
//     return (
//         <div className="max-w-3xl mx-auto">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>{book.title}</CardTitle>
//                     <CardDescription>By {book.author}</CardDescription>
//                 </CardHeader>
//                 <CardContent className="grid gap-6">
//                     <div className="aspect-w-2 aspect-h-3 w-full max-w-sm mx-auto">
//                         <Image
//                             src={book.cover_image || '/placeholder.svg'}
//                             alt={book.title}
//                             layout="fill"
//                             objectFit="cover"
//                             className="rounded-lg"
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <p><strong>ISBN:</strong> {book.isbn}</p>
//                         <p><strong>Category:</strong> {book.category}</p>
//                         <Badge variant={book.available ? 'default' : 'secondary'}>
//                             {book.available ? 'Available' : 'Unavailable'}
//                         </Badge>
//                     </div>
//                     <p className="text-muted-foreground">{book.description}</p>
//                 </CardContent>
//                 <CardFooter>
//                     <Button disabled={!book.available}>
//                         {book.available ? 'Borrow Book' : 'Currently Unavailable'}
//                     </Button>
//                 </CardFooter>
//             </Card>
//         </div>
//     )
// }




// 'use client'
//
// import { useState, useEffect } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import Image from 'next/image'
// import { supabase } from '@/lib/supabase-client'
// import { useAuth } from '@/contexts/AuthContext'
// import { Book } from '@/types/book'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Loading } from '@/components/ui/loading'
// import { useToast } from "@/hooks/use-toast"
// import { Toaster } from "@/components/ui/toaster"
//
// export default function BookDetails() {
//     const [book, setBook] = useState<Book | null>(null)
//     const [isLoading, setIsLoading] = useState(true)
//     const [isBorrowing, setIsBorrowing] = useState(false)
//     const [isReserving, setIsReserving] = useState(false)
//     const params = useParams()
//     const router = useRouter()
//     const { user } = useAuth()
//     const { toast } = useToast()
//     const id = params.id as string
//
//     useEffect(() => {
//         fetchBook()
//     }, [id])
//
//     const fetchBook = async () => {
//         setIsLoading(true)
//         try {
//             const { data, error } = await supabase
//                 .from('books')
//                 .select('*')
//                 .eq('id', id)
//                 .single()
//
//             if (error) throw error
//
//             setBook(data as Book)
//         } catch (error) {
//             console.error('Error fetching book:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to fetch book details. Please try again.",
//                 variant: "destructive",
//             })
//         } finally {
//             setIsLoading(false)
//         }
//     }
//
//     const handleBorrow = async () => {
//         if (!user) {
//             router.push('/login')
//             return
//         }
//
//         setIsBorrowing(true)
//         try {
//             const { data, error } = await supabase.rpc('borrow_book', {
//                 book_id: id,
//                 user_id: user.id
//             })
//
//             if (error) throw error
//
//             if (data) {
//                 toast({
//                     title: "Success",
//                     description: "Book borrowed successfully.",
//                 })
//                 fetchBook() // Refresh book data
//             } else {
//                 toast({
//                     title: "Error",
//                     description: "Failed to borrow the book. It might not be available.",
//                     variant: "destructive",
//                 })
//             }
//         } catch (error) {
//             console.error('Error borrowing book:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to borrow the book. Please try again.",
//                 variant: "destructive",
//             })
//         } finally {
//             setIsBorrowing(false)
//         }
//     }
//
//     const handleReserve = async () => {
//         if (!user) {
//             router.push('/login')
//             return
//         }
//
//         setIsReserving(true)
//         try {
//             const { data, error } = await supabase.rpc('reserve_book', {
//                 book_id: id,
//                 user_id: user.id
//             })
//
//             if (error) throw error
//
//             if (data) {
//                 toast({
//                     title: "Success",
//                     description: "Book reserved successfully.",
//                 })
//                 fetchBook() // Refresh book data
//             } else {
//                 toast({
//                     title: "Error",
//                     description: "Failed to reserve the book. It might already be available or reserved.",
//                     variant: "destructive",
//                 })
//             }
//         } catch (error) {
//             console.error('Error reserving book:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to reserve the book. Please try again.",
//                 variant: "destructive",
//             })
//         } finally {
//             setIsReserving(false)
//         }
//     }
//
//     if (isLoading) {
//         return <Loading />
//     }
//
//     if (!book) {
//         return <div className="text-center">Book not found</div>
//     }
//
//     return (
//         <div className="max-w-3xl mx-auto">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>{book.title}</CardTitle>
//                     <CardDescription>By {book.author}</CardDescription>
//                 </CardHeader>
//                 <CardContent className="grid gap-6">
//                     <div className="aspect-w-2 aspect-h-3 w-full max-w-sm mx-auto">
//                         <Image
//                             src={book.cover_image || '/placeholder.svg'}
//                             alt={book.title}
//                             layout="fill"
//                             objectFit="cover"
//                             className="rounded-lg"
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <p><strong>ISBN:</strong> {book.isbn}</p>
//                         <p><strong>Category:</strong> {book.category}</p>
//                         <Badge variant={book.available ? 'default' : 'secondary'}>
//                             {book.available ? 'Available' : 'Unavailable'}
//                         </Badge>
//                     </div>
//                     <p className="text-muted-foreground">{book.description}</p>
//                 </CardContent>
//                 <CardFooter className="flex justify-between">
//                     <Button
//                         onClick={handleBorrow}
//                         disabled={!book.available || isBorrowing}
//                     >
//                         {isBorrowing ? 'Borrowing...' : 'Borrow Book'}
//                     </Button>
//                     <Button
//                         onClick={handleReserve}
//                         disabled={book.available || isReserving}
//                         variant="outline"
//                     >
//                         {isReserving ? 'Reserving...' : 'Reserve Book'}
//                     </Button>
//                 </CardFooter>
//             </Card>
//             <Toaster />
//         </div>
//     )
// }



// 'use client'
//
// import { useState, useEffect } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import Image from 'next/image'
// import { supabase } from '@/lib/supabase-client'
// import { useAuth } from '@/contexts/AuthContext'
// import { Book } from '@/types/book'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Loading } from '@/components/ui/loading'
// import { useToast } from "@/hooks/use-toast"
// import { Toaster } from "@/components/ui/toaster"
//
// export default function BookDetails() {
//     const [book, setBook] = useState<Book | null>(null)
//     const [isLoading, setIsLoading] = useState(true)
//     const [isBorrowing, setIsBorrowing] = useState(false)
//     const [isReserving, setIsReserving] = useState(false)
//     const params = useParams()
//     const router = useRouter()
//     const { user } = useAuth()
//     const { toast } = useToast()
//     const bookId = params.id as string
//
//     useEffect(() => {
//         fetchBook()
//     }, [bookId])
//
//     const fetchBook = async () => {
//         setIsLoading(true)
//         try {
//             // 修改查询条件使用 book_id 而不是 id
//             const { data, error } = await supabase
//                 .from('books')
//                 .select(`
//                     *,
//                     categories(name)
//                 `)
//                 .eq('book_id', bookId)
//                 .single()
//
//             if (error) {
//                 throw error
//             }
//
//             if (data) {
//                 setBook(data as Book)
//             } else {
//                 toast({
//                     title: "Error",
//                     description: "Book not found",
//                     variant: "destructive",
//                 })
//             }
//         } catch (error) {
//             console.error('Error fetching book:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to fetch book details",
//                 variant: "destructive",
//             })
//         } finally {
//             setIsLoading(false)
//         }
//     }
//
//     const handleBorrow = async () => {
//         if (!user) {
//             router.push('/login')
//             return
//         }
//
//         setIsBorrowing(true)
//         try {
//             const { data, error } = await supabase.rpc('borrow_book', {
//                 p_user_id: user.id,
//                 p_book_id: bookId,
//                 p_due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
//             })
//
//             if (error) throw error
//
//             toast({
//                 title: "Success",
//                 description: "Book borrowed successfully",
//             })
//             fetchBook()
//         } catch (error) {
//             console.error('Error borrowing book:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to borrow the book",
//                 variant: "destructive",
//             })
//         } finally {
//             setIsBorrowing(false)
//         }
//     }
//
//     const handleReserve = async () => {
//         if (!user) {
//             router.push('/login')
//             return
//         }
//
//         setIsReserving(true)
//         try {
//             const { data, error } = await supabase.rpc('reserve_book', {
//                 book_id: parseInt(bookId),
//                 user_id: user.id
//             })
//
//             if (error) throw error
//
//             toast({
//                 title: "Success",
//                 description: "Book reserved successfully",
//             })
//             fetchBook()
//         } catch (error) {
//             console.error('Error reserving book:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to reserve the book",
//                 variant: "destructive",
//             })
//         } finally {
//             setIsReserving(false)
//         }
//     }
//
//     if (isLoading) {
//         return <Loading />
//     }
//
//     if (!book) {
//         return <div className="text-center py-8">Book not found</div>
//     }
//
//     return (
//         <div className="max-w-3xl mx-auto p-4">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>{book.title}</CardTitle>
//                     <CardDescription>By {book.author}</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                     <div className="relative aspect-[2/3] w-full max-w-sm mx-auto">
//                         <Image
//                             src={book.cover_image_url || '/images/placeholder.jpg'}
//                             alt={book.title}
//                             fill
//                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                             className="rounded-lg object-cover"
//                             priority // 添加 priority 属性
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <p><strong>ISBN:</strong> {book.isbn}</p>
//                         <p><strong>Category:</strong> {book.categories?.name}</p>
//                         <p><strong>Publisher:</strong> {book.publisher}</p>
//                         <p><strong>Publish Date:</strong> {book.publish_date && new Date(book.publish_date).toLocaleDateString()}</p>
//                         <Badge variant={book.available_copies > 0 ? 'default' : 'secondary'}>
//                             {book.available_copies > 0 ? `${book.available_copies} Available` : 'Unavailable'}
//                         </Badge>
//                     </div>
//                     {book.description && (
//                         <div>
//                             <h3 className="font-semibold mb-2">Description</h3>
//                             <p className="text-muted-foreground">{book.description}</p>
//                         </div>
//                     )}
//                 </CardContent>
//                 <CardFooter className="flex gap-4">
//                     <Button
//                         onClick={handleBorrow}
//                         disabled={book.available_copies === 0 || isBorrowing}
//                     >
//                         {isBorrowing ? 'Borrowing...' : 'Borrow Book'}
//                     </Button>
//                     <Button
//                         onClick={handleReserve}
//                         disabled={book.available_copies > 0 || isReserving}
//                         variant="outline"
//                     >
//                         {isReserving ? 'Reserving...' : 'Reserve Book'}
//                     </Button>
//                 </CardFooter>
//             </Card>
//             <Toaster />
//         </div>
//     )
// }


'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import { Book } from '@/types/book'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Calendar,
    BookCopy,
    User,
    Building2,
    CalendarDays,
    MapPin,
    Loader2,
    BookOpen,
    Clock
} from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { format } from 'date-fns'

export default function BookDetails() {
    const [book, setBook] = useState<Book | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isBorrowing, setIsBorrowing] = useState(false)
    const [isReserving, setIsReserving] = useState(false)
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const { toast } = useToast()
    const bookId = params.id as string

    useEffect(() => {
        fetchBook()
    }, [bookId])

    const fetchBook = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('books')
                .select(`
                    *,
                    categories(name)
                `)
                .eq('book_id', bookId)
                .single()

            if (error) throw error
            setBook(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch book details",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleBorrow = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        setIsBorrowing(true)
        try {
            const dueDate = new Date()
            dueDate.setDate(dueDate.getDate() + 14)

            const { error } = await supabase.rpc('borrow_book', {
                p_user_id: user.id,
                p_book_id: bookId,
                p_due_date: dueDate.toISOString()
            })

            if (error) throw error

            toast({
                title: "Success",
                description: "Book borrowed successfully",
            })
            fetchBook()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to borrow the book",
                variant: "destructive",
            })
        } finally {
            setIsBorrowing(false)
        }
    }

    const handleReserve = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        setIsReserving(true)
        try {
            const { error } = await supabase.rpc('reserve_book', {
                book_id: parseInt(bookId),
                user_id: user.id
            })

            if (error) throw error

            toast({
                title: "Success",
                description: "Book reserved successfully",
            })
            fetchBook()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reserve the book",
                variant: "destructive",
            })
        } finally {
            setIsReserving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!book) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-2xl font-bold">Book not found</h2>
                <p className="text-muted-foreground mt-2">
                    The book you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => router.push('/books')} className="mt-4">
                    Back to Books
                </Button>
            </div>
        )
    }

    return (
        <div className="container max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Book Cover and Actions */}
                <Card className="lg:col-span-1">
                    <CardContent className="p-6">
                        <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden mb-6">
                            <Image
                                src={book.cover_image_url || '/images/placeholder.jpg'}
                                alt={book.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="space-y-4">
                            <Badge
                                variant={book.available_copies > 0 ? 'default' : 'secondary'}
                                className="w-full justify-center py-1.5"
                            >
                                {book.available_copies > 0
                                    ? `${book.available_copies} Copies Available`
                                    : 'Currently Unavailable'
                                }
                            </Badge>
                            <Button
                                className="w-full"
                                onClick={handleBorrow}
                                disabled={book.available_copies === 0 || isBorrowing}
                            >
                                {isBorrowing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Borrowing...
                                    </>
                                ) : (
                                    <>
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Borrow Book
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleReserve}
                                disabled={book.available_copies > 0 || isReserving}
                            >
                                {isReserving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Reserving...
                                    </>
                                ) : (
                                    <>
                                        <Clock className="mr-2 h-4 w-4" />
                                        Reserve Book
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Book Details */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-3xl">{book.title}</CardTitle>
                        <CardDescription className="text-lg">
                            by {book.author}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Book Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <BookCopy className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">ISBN:</span>
                                    <span>{book.isbn}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Publisher:</span>
                                    <span>{book.publisher}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Published:</span>
                                    <span>
                                        {book.publish_date && format(new Date(book.publish_date), 'MMMM d, yyyy')}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Category:</span>
                                    <span>{book.categories?.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Location:</span>
                                    <span>{book.location || 'Not specified'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Loan Period:</span>
                                    <span>14 days</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Book Description */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">About this book</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {book.description || 'No description available.'}
                            </p>
                        </div>

                        <Separator />

                        {/* Borrowing Rules */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Borrowing Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <Card className="p-4 bg-muted">
                                    <h4 className="font-medium mb-2">Loan Period</h4>
                                    <p className="text-muted-foreground">
                                        Books can be borrowed for 14 days. Please return the book on time
                                        to avoid any late fees.
                                    </p>
                                </Card>
                                <Card className="p-4 bg-muted">
                                    <h4 className="font-medium mb-2">Reservations</h4>
                                    <p className="text-muted-foreground">
                                        If the book is currently unavailable, you can place a reservation
                                        and we'll notify you when it's ready.
                                    </p>
                                </Card>
                            </div>
                        </div>

                        {book.available_copies === 0 && (
                            <Alert>
                                <CalendarDays className="h-4 w-4" />
                                <AlertTitle>Currently Unavailable</AlertTitle>
                                <AlertDescription>
                                    This book is currently borrowed. You can place a reservation to be
                                    notified when it becomes available.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
