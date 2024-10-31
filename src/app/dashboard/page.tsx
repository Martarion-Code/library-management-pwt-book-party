// 'use client'
//
// import { useEffect, useState } from 'react'
// import { useAuth } from '@/contexts/AuthContext'
// import { supabase } from '@/lib/supabase-client'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { useRouter } from 'next/navigation'
//
// type DashboardStats = {
//     totalBooks: number
//     borrowedBooks: number
//     overdueBooks: number
// }
//
// export default function Dashboard() {
//     const { user, signOut } = useAuth()
//     const [stats, setStats] = useState<DashboardStats>({
//         totalBooks: 0,
//         borrowedBooks: 0,
//         overdueBooks: 0,
//     })
//     const router = useRouter()
//
//     useEffect(() => {
//         if (user) {
//             fetchDashboardStats()
//         }
//     }, [user])
//
//     const fetchDashboardStats = async () => {
//         try {
//             const { data, error } = await supabase.rpc('get_user_dashboard_stats', {
//                 user_id: user?.id,
//             })
//             if (error) throw error
//             setStats(data)
//         } catch (error) {
//             console.error('Error fetching dashboard stats:', error)
//         }
//     }
//
//     const handleSignOut = async () => {
//         try {
//             await signOut()
//             router.push('/')
//         } catch (error) {
//             console.error('Error signing out:', error)
//         }
//     }
//
//     if (!user) {
//         return <div>Loading...</div>
//     }
//
//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
//                 <Button onClick={handleSignOut}>Sign Out</Button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Total Books</CardTitle>
//                         <CardDescription>Number of books in the library</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-3xl font-bold">{stats.totalBooks}</p>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Borrowed Books</CardTitle>
//                         <CardDescription>Books currently borrowed by you</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-3xl font-bold">{stats.borrowedBooks}</p>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Overdue Books</CardTitle>
//                         <CardDescription>Books past their due date</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-3xl font-bold">{stats.overdueBooks}</p>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     )
// }



'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Loading } from '@/components/ui/loading'

type DashboardStats = {
    totalBooks: number
    borrowedBooks: number
    overdueBooks: number
}

type BorrowedBook = {
    id: number
    title: string
    author: string
    due_date: string
}

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const [stats, setStats] = useState<DashboardStats>({
        totalBooks: 0,
        borrowedBooks: 0,
        overdueBooks: 0,
    })
    const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        if (user) {
            fetchDashboardData()
        }
    }, [user])

    const fetchDashboardData = async () => {
        setIsLoading(true)
        try {
            const [statsResult, booksResult] = await Promise.all([
                supabase.rpc('get_user_dashboard_stats', { user_id: user?.id }),
                supabase
                    .from('loans')
                    .select('id, books(id, title, author), due_date')
                    .eq('user_id', user?.id)
                    .eq('status', 'active')
            ])

            if (statsResult.error) throw statsResult.error
            if (booksResult.error) throw booksResult.error

            setStats(statsResult.data)
            setBorrowedBooks(booksResult.data.map(loan => ({
                id: loan.books.id,
                title: loan.books.title,
                author: loan.books.author,
                due_date: loan.due_date
            })))
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            toast({
                title: "Error",
                description: "Failed to fetch dashboard data. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/')
        } catch (error) {
            console.error('Error signing out:', error)
            toast({
                title: "Error",
                description: "Failed to sign out. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleReturnBook = async (bookId: number) => {
        try {
            const { error } = await supabase.rpc('return_book', {
                book_id: bookId,
                user_id: user?.id
            })

            if (error) throw error

            toast({
                title: "Success",
                description: "Book returned successfully.",
            })
            fetchDashboardData() // Refresh dashboard data
        } catch (error) {
            console.error('Error returning book:', error)
            toast({
                title: "Error",
                description: "Failed to return the book. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <Loading />
    }

    if (!user) {
        return <div>Please log in to view your dashboard.</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
                <Button onClick={handleSignOut}>Sign Out</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Books</CardTitle>
                        <CardDescription>Number of books in the library</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalBooks}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Borrowed Books</CardTitle>
                        <CardDescription>Books currently borrowed by you</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.borrowedBooks}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Overdue Books</CardTitle>
                        <CardDescription>Books past their due date</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.overdueBooks}</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Borrowed Books</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {borrowedBooks.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>{new Date(book.due_date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleReturnBook(book.id)} size="sm">
                                            Return
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Toaster />
        </div>
    )
}
