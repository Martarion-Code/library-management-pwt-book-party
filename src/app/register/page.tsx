// 'use client'
//
// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { useAuth } from '@/contexts/AuthContext'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// import { AlertCircle } from 'lucide-react'
//
// export default function Register() {
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [error, setError] = useState<string | null>(null)
//     const { signUp } = useAuth()
//     const router = useRouter()
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         setError(null)
//         try {
//             await signUp(email, password)
//             router.push('/dashboard')
//         } catch (error) {
//             setError('Failed to create an account. Please try again.')
//         }
//     }
//
//     return (
//         <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.32))]">
//             <Card className="w-full max-w-md">
//                 <CardHeader>
//                     <CardTitle>Register</CardTitle>
//                     <CardDescription>Create a new account to access the library system</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div>
//                             <Label htmlFor="email">Email</Label>
//                             <Input
//                                 id="email"
//                                 type="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <Label htmlFor="password">Password</Label>
//                             <Input
//                                 id="password"
//                                 type="password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         {error && (
//                             <Alert variant="destructive">
//                                 <AlertCircle className="h-4 w-4" />
//                                 <AlertTitle>Error</AlertTitle>
//                                 <AlertDescription>{error}</AlertDescription>
//                             </Alert>
//                         )}
//                         <Button type="submit" className="w-full">
//                             Sign Up
//                         </Button>
//                     </form>
//                 </CardContent>
//                 <CardFooter className="flex justify-center">
//                     <p>
//                         Already have an account?{' '}
//                         <Link href="/login" className="text-primary hover:underline">
//                             Login here
//                         </Link>
//                     </p>
//                 </CardFooter>
//             </Card>
//         </div>
//     )
// }



'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        fullName: ''
    })
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { signUp } = useAuth()
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validateForm = () => {
        if (!formData.username.trim()) {
            setError('Username is required')
            return false
        }
        if (!formData.fullName.trim()) {
            setError('Full name is required')
            return false
        }
        if (!formData.email.trim()) {
            setError('Email is required')
            return false
        }
        if (!formData.password.trim()) {
            setError('Password is required')
            return false
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        try {
            await signUp(
                formData.email,
                formData.password,
                formData.username,
                formData.fullName
            )
            router.push('/dashboard')
        } catch (error) {
            console.error('Registration error:', error)
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Failed to create an account. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.32))]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create a new account to access the library system</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing up...' : 'Sign Up'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p>
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Login here
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
