'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase-client'
import { Book } from '@/types/book'
import BookCard from '@/components/books/BookCard'
import SearchFilters from '@/components/books/SearchFilters'
import { PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Category {
    id: number;
    name: string;
}
export default function BookCatalog() {
    const [books, setBooks] = useState<Book[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const booksPerPage = 12

    const fetchCategories = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('name, category_id')
                .order('name', { ascending: true })

            if (error) throw error
            setCategories(data.map(category => ({id: category.category_id, name: category.name })))
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }, [])

    const fetchBooks = useCallback(async () => {
        setIsLoading(true)
        try {
            let query = supabase
                .from('books')
                .select('*', { count: 'exact' })
                .order('title', { ascending: true })
                .range((currentPage - 1) * booksPerPage, currentPage * booksPerPage - 1)

            if (searchTerm) {
                query = query.ilike('title', `%${searchTerm}%`)
            }

            if (selectedCategory && selectedCategory !== 'all') {
                query = query.eq('category_id', selectedCategory)
            }

            const { data, error, count } = await query

            if (error) throw error

            setBooks(data as Book[])
            setTotalPages(Math.ceil((count || 0) / booksPerPage))
        } catch (error) {
            console.error('Error fetching books:', error)
        } finally {
            setIsLoading(false)
        }
    }, [currentPage, searchTerm, selectedCategory, booksPerPage])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    useEffect(() => {
        fetchBooks()
    }, [fetchBooks])

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value)
        setCurrentPage(1)
    }

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Book Catalog</h1>
            <SearchFilters
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                categories={categories}
            />
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div
                            key={`skeleton-${index}`}
                            className="h-64 bg-gray-200 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <>
                    {books.length === 0 ? (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-semibold mb-2">No books found</h2>
                            <p className="text-muted-foreground">
                                Try adjusting your search or filters to find what you&apos;re looking for.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {books.map((book) => (
                                <BookCard key={book.book_id} book={book} />
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <nav className="flex justify-center mt-8">
                            <PaginationContent>
                                <PaginationItem>
                                    <Button
                                        variant="outline"
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className="mr-2"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>
                                </PaginationItem>

                                <PaginationItem>
                                    <span className="flex items-center px-4">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </PaginationItem>

                                <PaginationItem>
                                    <Button
                                        variant="outline"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="ml-2"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </PaginationItem>
                            </PaginationContent>
                        </nav>
                    )}
                </>
            )}
        </div>
    )
}
