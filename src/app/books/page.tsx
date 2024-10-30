'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-client'
import { Book } from '@/types/book'
import BookCard from '@/components/books/BookCard'
import SearchFilters from '@/components/books/SearchFilters'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

export default function BookCatalog() {
    const [books, setBooks] = useState<Book[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const booksPerPage = 12

    useEffect(() => {
        fetchCategories()
        fetchBooks()
    }, [currentPage, searchTerm, selectedCategory])

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('name')
                .order('name', { ascending: true })

            if (error) throw error

            setCategories(data.map(category => category.name))
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const fetchBooks = async () => {
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
                query = query.eq('category', selectedCategory)
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
    }

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value)
        setCurrentPage(1)
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
                    {[...Array(12)].map((_, index) => (
                        <div key={index} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            {[...Array(totalPages)].map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href="#"
                                        onClick={() => setCurrentPage(index + 1)}
                                        isActive={currentPage === index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}
        </div>
    )
}
