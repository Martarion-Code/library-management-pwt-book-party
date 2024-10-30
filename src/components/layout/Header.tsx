'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export default function Header() {
    const { user, signOut } = useAuth()

    return (
        <header className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    LMS
                </Link>
                <nav>
                    <ul className="flex space-x-4 items-center">
                        <li>
                            <Link href="/books" className="hover:underline">
                                Books
                            </Link>
                        </li>
                        {user ? (
                            <>
                                <li>
                                    <Link href="/dashboard" className="hover:underline">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Button variant="outline" onClick={() => signOut()}>
                                        Sign Out
                                    </Button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/login">
                                        <Button variant="outline">Login</Button>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/register">
                                        <Button>Register</Button>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    )
}
