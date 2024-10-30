'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

type DashboardStats = {
    totalBooks: number
    borrowedBooks: number
    overdueBooks: number
}

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const [stats, setStats] = useState<DashboardStats>({
        totalBooks: 0,
        borrowedBooks: 0,
        overdueBooks: 0,
    })
    const router = useRouter()

    useEffect(() => {
        if (user) {
            fetchDashboardStats()
        }
    }, [user])

    const fetchDashboardStats = async () => {
        try {
            const { data, error } = await supabase.rpc('get_user_dashboard_stats', {
                user_id: user?.id,
            })
            if (error) throw error
            setStats(data)
        } catch (error) {
            console.error('Error fetching dashboard stats:', error)
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    if (!user) {
        return <div>Loading...</div>
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
        </div>
    )
}
