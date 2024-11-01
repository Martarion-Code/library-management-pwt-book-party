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



// 'use client'
//
// import { useEffect, useState } from 'react'
// import { useAuth } from '@/contexts/AuthContext'
// import { supabase } from '@/lib/supabase-client'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { useRouter } from 'next/navigation'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { useToast } from "@/hooks/use-toast"
// import { Toaster } from "@/components/ui/toaster"
// import { Loading } from '@/components/ui/loading'
//
// type DashboardStats = {
//     totalBooks: number
//     borrowedBooks: number
//     overdueBooks: number
// }
//
// type BorrowedBook = {
//     id: number
//     title: string
//     author: string
//     due_date: string
// }
//
// export default function Dashboard() {
//     const { user, signOut } = useAuth()
//     const [stats, setStats] = useState<DashboardStats>({
//         totalBooks: 0,
//         borrowedBooks: 0,
//         overdueBooks: 0,
//     })
//     const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
//     const [isLoading, setIsLoading] = useState(true)
//     const router = useRouter()
//     const { toast } = useToast()
//
//     useEffect(() => {
//         if (user) {
//             fetchDashboardData()
//         }
//     }, [user])
//
//     const fetchDashboardData = async () => {
//         setIsLoading(true)
//         try {
//             const [statsResult, booksResult] = await Promise.all([
//                 supabase.rpc('get_user_dashboard_stats', { user_id: user?.id }),
//                 supabase
//                     .from('loans')
//                     .select('id, books(id, title, author), due_date')
//                     .eq('user_id', user?.id)
//                     .eq('status', 'active')
//             ])
//
//             if (statsResult.error) throw statsResult.error
//             if (booksResult.error) throw booksResult.error
//
//             setStats(statsResult.data)
//             setBorrowedBooks(booksResult.data.map(loan => ({
//                 id: loan.books.id,
//                 title: loan.books.title,
//                 author: loan.books.author,
//                 due_date: loan.due_date
//             })))
//         } catch (error) {
//             console.error('Error fetching dashboard data:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to fetch dashboard data. Please try again.",
//                 variant: "destructive",
//             })
//         } finally {
//             setIsLoading(false)
//         }
//     }
//
//     const handleSignOut = async () => {
//         try {
//             await signOut()
//             router.push('/')
//         } catch (error) {
//             console.error('Error signing out:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to sign out. Please try again.",
//                 variant: "destructive",
//             })
//         }
//     }
//
//     const handleReturnBook = async (bookId: number) => {
//         try {
//             const { error } = await supabase.rpc('return_book', {
//                 book_id: bookId,
//                 user_id: user?.id
//             })
//
//             if (error) throw error
//
//             toast({
//                 title: "Success",
//                 description: "Book returned successfully.",
//             })
//             fetchDashboardData() // Refresh dashboard data
//         } catch (error) {
//             console.error('Error returning book:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to return the book. Please try again.",
//                 variant: "destructive",
//             })
//         }
//     }
//
//     if (isLoading) {
//         return <Loading />
//     }
//
//     if (!user) {
//         return <div>Please log in to view your dashboard.</div>
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
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Your Borrowed Books</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Title</TableHead>
//                                 <TableHead>Author</TableHead>
//                                 <TableHead>Due Date</TableHead>
//                                 <TableHead>Action</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {borrowedBooks.map((book) => (
//                                 <TableRow key={book.id}>
//                                     <TableCell>{book.title}</TableCell>
//                                     <TableCell>{book.author}</TableCell>
//                                     <TableCell>{new Date(book.due_date).toLocaleDateString()}</TableCell>
//                                     <TableCell>
//                                         <Button onClick={() => handleReturnBook(book.id)} size="sm">
//                                             Return
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </CardContent>
//             </Card>
//             <Toaster />
//         </div>
//     )
// }



// 'use client'
//
// import { useEffect, useState } from 'react'
// import { useAuth } from '@/contexts/AuthContext'
// import { supabase } from '@/lib/supabase-client'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { useToast } from "@/hooks/use-toast"
// import { Toaster } from "@/components/ui/toaster"
// import { Loading } from '@/components/ui/loading'
// import type { DashboardStats, BorrowedBook } from '@/types/dashboard'
//
// export default function Dashboard() {
//     const { user } = useAuth()
//     const [stats, setStats] = useState<DashboardStats>({
//         totalbooks: 0,
//         borrowedbooks: 0,
//         overduebooks: 0
//     })
//     const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
//     const [isLoading, setIsLoading] = useState(true)
//     const { toast } = useToast()
//
//     useEffect(() => {
//         if (user) {
//             fetchDashboardData()
//         }
//     }, [user])
//
//     const fetchDashboardData = async () => {
//         setIsLoading(true)
//         try {
//             // 获取仪表盘统计数据
//             const { data: statsData, error: statsError } = await supabase
//                 .rpc('get_user_dashboard_stats', {
//                     user_id: user?.id
//                 })
//
//             if (statsError) throw statsError
//             if (statsData && statsData.length > 0) {
//                 setStats(statsData[0])
//             }
//
//             // 获取当前借阅的书籍
//             const { data: loansData, error: loansError } = await supabase
//                 .from('loans')
//                 .select(`
//                     loan_id,
//                     books (
//                         book_id,
//                         title,
//                         author
//                     ),
//                     due_date
//                 `)
//                 .eq('user_id', user?.id)
//                 .eq('status', 'borrowed')
//
//             if (loansError) throw loansError
//
//             if (loansData) {
//                 const borrowedBooks = loansData.map(loan => ({
//                     id: loan.loan_id,
//                     title: loan.books.title,
//                     author: loan.books.author,
//                     due_date: loan.due_date
//                 }))
//                 setBorrowedBooks(borrowedBooks)
//             }
//
//         } catch (error) {
//             console.error('Error fetching dashboard data:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to fetch dashboard data. Please try again.",
//                 variant: "destructive",
//             })
//         } finally {
//             setIsLoading(false)
//         }
//     }
//
//     const handleReturnBook = async (loanId: string) => {
//         try {
//             const { error } = await supabase
//                 .rpc('return_book', {
//                     p_loan_id: loanId
//                 })
//
//             if (error) throw error
//
//             toast({
//                 title: "Success",
//                 description: "Book returned successfully",
//             })
//             fetchDashboardData() // 刷新数据
//         } catch (error) {
//             console.error('Error returning book:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to return the book. Please try again.",
//                 variant: "destructive",
//             })
//         }
//     }
//
//     if (isLoading) {
//         return <Loading />
//     }
//
//     if (!user) {
//         return <div>Please log in to view your dashboard.</div>
//     }
//
//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Total Books</CardTitle>
//                         <CardDescription>Number of books in the library</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-3xl font-bold">{stats.totalbooks}</p>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Borrowed Books</CardTitle>
//                         <CardDescription>Books currently borrowed by you</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-3xl font-bold">{stats.borrowedbooks}</p>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Overdue Books</CardTitle>
//                         <CardDescription>Books past their due date</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-3xl font-bold">{stats.overduebooks}</p>
//                     </CardContent>
//                 </Card>
//             </div>
//
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Your Borrowed Books</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Title</TableHead>
//                                 <TableHead>Author</TableHead>
//                                 <TableHead>Due Date</TableHead>
//                                 <TableHead>Action</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {borrowedBooks.map((book) => (
//                                 <TableRow key={book.id}>
//                                     <TableCell>{book.title}</TableCell>
//                                     <TableCell>{book.author}</TableCell>
//                                     <TableCell>
//                                         {new Date(book.due_date).toLocaleDateString()}
//                                     </TableCell>
//                                     <TableCell>
//                                         <Button
//                                             onClick={() => handleReturnBook(book.id)}
//                                             size="sm"
//                                         >
//                                             Return
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                             {borrowedBooks.length === 0 && (
//                                 <TableRow>
//                                     <TableCell colSpan={4} className="text-center">
//                                         No books currently borrowed
//                                     </TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </CardContent>
//             </Card>
//             <Toaster />
//         </div>
//     )
// }



'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { format, isPast } from 'date-fns'
import {
    BookOpen,
    BookX,
    Clock,
    Library,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    RotateCcw
} from 'lucide-react'
import type { DashboardStats, BorrowedBook } from '@/types/dashboard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

export default function Dashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState<DashboardStats>({
        totalbooks: 0,
        borrowedbooks: 0,
        overduebooks: 0
    })
    const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isReturning, setIsReturning] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        if (user) {
            fetchDashboardData()
        }
    }, [user])

    const fetchDashboardData = async () => {
        setIsLoading(true)
        try {
            const [statsResult, loansResult] = await Promise.all([
                supabase.rpc('get_user_dashboard_stats', { user_id: user?.id }),
                supabase
                    .from('loans')
                    .select(`
                        loan_id,
                        due_date,
                        books (
                            book_id,
                            title,
                            author,
                            cover_image_url
                        )
                    `)
                    .eq('user_id', user?.id)
                    .eq('status', 'borrowed')
                    .order('due_date', { ascending: true })
            ])

            if (statsResult.error) throw statsResult.error
            if (loansResult.error) throw loansResult.error

            if (statsResult.data && statsResult.data.length > 0) {
                setStats(statsResult.data[0])
            }

            if (loansResult.data) {
                setBorrowedBooks(loansResult.data.map(loan => ({
                    id: loan.loan_id,
                    title: loan.books.title,
                    author: loan.books.author,
                    due_date: loan.due_date,
                    cover_image: loan.books.cover_image_url
                })))
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            toast({
                title: "Error",
                description: "Failed to fetch dashboard data",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleReturnBook = async (loanId: string) => {
        setIsReturning(loanId)
        try {
            const { error } = await supabase.rpc('return_book', {
                p_loan_id: loanId
            })

            if (error) throw error

            toast({
                title: "Success",
                description: "Book returned successfully",
            })
            fetchDashboardData()
        } catch (error) {
            console.error('Error returning book:', error)
            toast({
                title: "Error",
                description: "Failed to return the book",
                variant: "destructive",
            })
        } finally {
            setIsReturning(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    const calculateProgress = () => {
        const total = stats.totalbooks || 1 // Prevent division by zero
        const borrowed = stats.borrowedbooks || 0
        return (borrowed / total) * 100
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <Button variant="outline" onClick={() => fetchDashboardData()}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                        <Library className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalbooks}</div>
                        <p className="text-xs text-muted-foreground">
                            Available in library
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Borrowed Books</CardTitle>
                        <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.borrowedbooks}</div>
                        <Progress value={calculateProgress()} className="mt-2" />
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900 dark:to-yellow-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {borrowedBooks.filter(book => {
                                const dueDate = new Date(book.due_date)
                                const today = new Date()
                                const diff = dueDate.getTime() - today.getTime()
                                return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000 // 3 days
                            }).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Books due in next 3 days
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900 dark:to-red-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
                        <BookX className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overduebooks}</div>
                        <p className="text-xs text-muted-foreground">
                            Please return immediately
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Borrowed Books */}
            <Card>
                <CardHeader>
                    <CardTitle>Currently Borrowed Books</CardTitle>
                    <CardDescription>
                        Manage your borrowed books and their due dates
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {borrowedBooks.length === 0 ? (
                        <div className="text-center py-6">
                            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="mt-2 text-lg font-semibold">No books borrowed</h3>
                            <p className="text-sm text-muted-foreground">
                                Visit our catalog to discover and borrow books
                            </p>
                            <Button className="mt-4" asChild>
                                <a href="/books">Browse Books</a>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Book</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {borrowedBooks.map((book) => {
                                    const isOverdue = isPast(new Date(book.due_date))
                                    const isDueSoon = !isOverdue &&
                                        new Date(book.due_date).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000

                                    return (
                                        <TableRow key={book.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center space-x-3">
                                                    <div className="font-medium">{book.title}</div>
                                                    <span className="text-muted-foreground">
                                                        by {book.author}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(book.due_date), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell>
                                                {isOverdue ? (
                                                    <div className="flex items-center">
                                                        <AlertTriangle className="h-4 w-4 text-destructive mr-2" />
                                                        <span className="text-destructive">Overdue</span>
                                                    </div>
                                                ) : isDueSoon ? (
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                                                        <span className="text-yellow-500">Due Soon</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                                        <span className="text-green-500">On Time</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleReturnBook(book.id)}
                                                    disabled={isReturning === book.id}
                                                >
                                                    {isReturning === book.id ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Returning...
                                                        </>
                                                    ) : (
                                                        'Return Book'
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {stats.overduebooks > 0 && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Overdue Books Notice</AlertTitle>
                    <AlertDescription>
                        You have {stats.overduebooks} overdue {stats.overduebooks === 1 ? 'book' : 'books'}.
                        Please return them as soon as possible to avoid additional fees.
                    </AlertDescription>
                </Alert>
            )}
            <Toaster />
        </div>
    )
}
