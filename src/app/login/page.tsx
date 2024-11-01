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
// export default function Login() {
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [error, setError] = useState<string | null>(null)
//     const { signIn } = useAuth()
//     const router = useRouter()
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         setError(null)
//         try {
//             await signIn(email, password)
//             router.push('/dashboard')
//         } catch (error) {
//             setError('Failed to sign in. Please check your credentials.')
//         }
//     }
//
//     return (
//         <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.32))]">
//             <Card className="w-full max-w-md">
//                 <CardHeader>
//                     <CardTitle>Login</CardTitle>
//                     <CardDescription>Enter your credentials to access your account</CardDescription>
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
//                             Sign In
//                         </Button>
//                     </form>
//                 </CardContent>
//                 <CardFooter className="flex justify-center">
//                     <p>
//                         Don't have an account?{' '}
//                         <Link href="/register" className="text-primary hover:underline">
//                             Register here
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
import { AlertCircle, Loader2 } from 'lucide-react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { signIn } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            await signIn(email, password)
            router.push('/dashboard')
        } catch (error) {
            setError('Invalid credentials. Please check your email and password.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                                className="w-full"
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
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <div className="w-full text-center">
                        {/*<p className="text-sm text-muted-foreground">*/}
                        {/*    Don't have an account?{' '}*/}
                        {/*    <Link*/}
                        {/*        href="/register"*/}
                        {/*        className="text-primary hover:underline font-medium"*/}
                        {/*    >*/}
                        {/*        Create one now*/}
                        {/*    </Link>*/}
                        {/*</p>*/}

                        <p className="text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/register"
                                className="text-primary hover:underline font-medium"
                            >
                                Create one now
                            </Link>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
