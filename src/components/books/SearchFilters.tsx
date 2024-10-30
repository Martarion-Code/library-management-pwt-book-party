import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type SearchFiltersProps = {
    searchTerm: string
    onSearchChange: (value: string) => void
    selectedCategory: string
    onCategoryChange: (value: string) => void
    categories: string[]
}

export default function SearchFilters({
                                          searchTerm,
                                          onSearchChange,
                                          selectedCategory,
                                          onCategoryChange,
                                          categories,
                                      }: SearchFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <Label htmlFor="search" className="sr-only">
                    Search books
                </Label>
                <Input
                    id="search"
                    type="text"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="w-full sm:w-48">
                <Label htmlFor="category" className="sr-only">
                    Category
                </Label>
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
