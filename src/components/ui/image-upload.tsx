'use client'

import { useState } from 'react'
import { Button } from './button'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'

interface ImageUploadProps {
    value: string
    onChange: (value: string) => void
    onUpload: (file: File) => Promise<void>
    disabled?: boolean
}

export function ImageUpload({
    value,
    onChange,
    onUpload,
    disabled
}: ImageUploadProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        
        console.log('eeeee', e.target.files)
        if (!e.target.files?.[0]) return

        try {
            setIsLoading(true)
            await onUpload(e.target.files[0])
        } catch (error) {
            console.error('Error uploading file:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemove = () => {
        onChange('')
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-40 h-40">
                {value ? (
                    <>
                        <Image
                            src={value}
                            alt="Cover"
                            fill
                            className="object-cover rounded-md"
                        />
                        <button
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white"
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </>
                ) : (
                    <div className="w-full h-full border-2 border-dashed rounded-md flex items-center justify-center">
                        <Upload className="h-10 w-10 text-gray-400" />
                    </div>
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                disabled={disabled || isLoading}
                className="hidden"
                id="cover-image-upload"
            />
            <label htmlFor="cover-image-upload">
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled || isLoading}
                    className="cursor-pointer"
                    asChild
                >
                    <span>
                        {isLoading ? 'Uploading...' : 'Upload Image'}
                    </span>
                </Button>
            </label>
        </div>
    )
}