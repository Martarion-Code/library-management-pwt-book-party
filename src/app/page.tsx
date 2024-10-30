import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.32))]">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Library Management System</h1>
        <p className="text-xl mb-8 text-center max-w-2xl">
          Explore our vast collection of books, manage your loans, and discover new reads.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/books">Browse Books</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
  )
}
