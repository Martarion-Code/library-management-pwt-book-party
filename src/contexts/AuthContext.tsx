'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase-client'

type AuthContextType = {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
    }

    // const signUp = async (email: string, password: string) => {
    //     const { error } = await supabase.auth.signUp({ email, password })
    //     if (error) throw error
    // }

    const signUp = async (email: string, password: string, username: string, fullName: string) => {
        try {
            // 1. 创建认证用户
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        full_name: fullName
                    }
                }
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('Failed to create auth user')

            // 2. 创建用户记录
            const { error: dbError } = await supabase
                .from('users')
                .insert({
                    user_id: authData.user.id,
                    username,
                    email,
                    full_name: fullName,
                    password_hash: password, // 注意：实际项目中应该使用proper hashing
                    membership_type: 'regular'
                })

            if (dbError) {
                console.error('Database error:', dbError)
                // 如果数据库插入失败，尝试删除auth用户
                await supabase.auth.signOut()
                throw new Error('Failed to create user profile')
            }

            return authData
        } catch (error) {
            console.error('SignUp error:', error)
            throw error
        }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
