// 'use client'
//
// import Link from 'next/link'
// import { useAuth } from '@/contexts/AuthContext'
// import { Button } from '@/components/ui/button'
//
// export default function Header() {
//     const { user, signOut } = useAuth()
//
//     return (
//         <header className="bg-primary text-primary-foreground">
//             <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//                 <Link href="/" className="text-2xl font-bold">
//                     LMS
//                 </Link>
//                 <nav>
//                     <ul className="flex space-x-4 items-center">
//                         <li>
//                             <Link href="/books" className="hover:underline">
//                                 Books
//                             </Link>
//                         </li>
//                         {user ? (
//                             <>
//                                 <li>
//                                     <Link href="/dashboard" className="hover:underline">
//                                         Dashboard
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Button variant="outline" onClick={() => signOut()}>
//                                         Sign Out
//                                     </Button>
//                                 </li>
//                             </>
//                         ) : (
//                             <>
//                                 <li>
//                                     <Link href="/login">
//                                         <Button variant="outline">Login</Button>
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link href="/register">
//                                         <Button>Register</Button>
//                                     </Link>
//                                 </li>
//                             </>
//                         )}
//                     </ul>
//                 </nav>
//             </div>
//         </header>
//     )
// }



'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { BookOpenCheck, UserCircle } from 'lucide-react'

export default function Header() {
    const { user, signOut } = useAuth()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container h-14 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <BookOpenCheck className="h-6 w-6" />
                        <span className="font-bold hidden md:inline-block">Library System</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/books" className="nav-link">
                            Browse Books
                        </Link>
                        {user && (
                            <Link href="/dashboard" className="nav-link">
                                Dashboard
                            </Link>
                        )}
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-2">
                                <UserCircle className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {user.email}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => signOut()}
                                size="sm"
                            >
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
