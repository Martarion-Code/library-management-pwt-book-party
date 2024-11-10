'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase-client'

type AuthContextType = {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    // signUp: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, username: string, fullName: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const syncUserProfile = async (currentUser: User) => {
        try {
            // 首先检查用户是否存在
            const { data: existingUser, error: checkError } = await supabase
                .from('users')
                .select('*')
                .eq('user_id', currentUser.id)
                .maybeSingle()

            if (checkError) {
                console.error('Error checking user:', checkError)
                return
            }

            if (!existingUser) {
                // 如果用户不存在，创建新用户记录
                const { error: insertError } = await supabase
                    .from('users')
                    .insert([
                        {
                            user_id: currentUser.id,
                            email: currentUser.email,
                            username: currentUser.email?.split('@')[0] || 'user',
                            full_name: currentUser.user_metadata.full_name || 'Unknown',
                            password_hash: 'PLACEHOLDER', // 实际项目中应该使用proper hashing
                            membership_type: 'regular'
                        }
                    ])
                    .select()
                    .single()

                if (insertError) {
                    console.error('Error creating user profile:', insertError)
                    throw new Error('Failed to create user profile')
                }
            }
        } catch (error) {
            console.error('Error syncing user profile:', error)
            throw error
        }
    }


    useEffect(() => {

        const setupAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user) {
                    await syncUserProfile(session.user)
                    setUser(session.user)
                }
            } catch (error) {
                console.error('Auth setup error:', error)
            } finally {
                setLoading(false)
            }
        }

        setupAuth()



        // const { data: authListener } = supabase.auth.onAuthStateChange(
        //     async (event, session) => {
        //         setUser(session?.user ?? null)
        //         setLoading(false)
        //     }
        // )


        // const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        //     const currentUser = session?.user ?? null
        //     setUser(currentUser)
        //     setLoading(false)
        //
        //     // 如果用户登录，确保users表中存在对应记录
        //     if (currentUser) {
        //         const { data: existingUser, error: checkError } = await supabase
        //             .from('users')
        //             .select('user_id')
        //             .eq('user_id', currentUser.id)
        //             .single()
        //
        //         if (!existingUser && !checkError) {
        //             // 如果用户不存在，创建用户记录
        //             const { error: insertError } = await supabase
        //                 .from('users')
        //                 .insert({
        //                     user_id: currentUser.id,
        //                     email: currentUser.email,
        //                     username: currentUser.email?.split('@')[0] || 'user',
        //                     full_name: currentUser.user_metadata.full_name || 'Unknown',
        //                     password_hash: 'PLACEHOLDER', // 实际项目中应该使用proper hashing
        //                     membership_type: 'regular'
        //                 })
        //
        //             if (insertError) {
        //                 console.error('Error creating user record:', insertError)
        //             }
        //         }
        //     }
        // })

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                try {
                    await syncUserProfile(session.user)
                    setUser(session.user)
                } catch (error) {
                    console.error('Auth state change error:', error)
                    setUser(null)
                }
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    // const signIn = async (email: string, password: string) => {
    //     const { error } = await supabase.auth.signInWithPassword({ email, password })
    //     if (error) throw error
    // }

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) throw error

        if (data.user) {
            await syncUserProfile(data.user)
        }
    }

    // const signUp = async (email: string, password: string, username: string, fullName: string) => {
    //     try {
    //         // 1. 创建认证用户
    //         const { data: authData, error: authError } = await supabase.auth.signUp({
    //             email,
    //             password,
    //             options: {
    //                 data: {
    //                     username,
    //                     full_name: fullName
    //                 }
    //             }
    //         })
    //
    //         if (authError) throw authError
    //         if (!authData.user) throw new Error('Failed to create auth user')
    //
    //         // 2. 创建用户记录
    //         const { error: dbError } = await supabase
    //             .from('users')
    //             .insert({
    //                 user_id: authData.user.id,
    //                 username,
    //                 email,
    //                 full_name: fullName,
    //                 password_hash: password, // 注意：实际项目中应该使用proper hashing
    //                 membership_type: 'regular'
    //             })
    //
    //         if (dbError) {
    //             // console.error('Database error:', dbError)
    //             // 如果数据库插入失败，尝试删除auth用户
    //             await supabase.auth.signOut()
    //             // throw new Error('Failed to create user profile')
    //             throw dbError
    //         }
    //
    //         return authData
    //     } catch (error) {
    //         console.error('SignUp error:', error)
    //         throw error
    //     }
    // }


    const signUp = async (email: string, password: string, username: string, fullName: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        full_name: fullName
                    }
                }
            })

            if (error) throw error
            if (!data.user) throw new Error('No user data returned')

            await syncUserProfile(data.user)
            return data
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
