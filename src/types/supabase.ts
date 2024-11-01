export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            books: {
                Row: {
                    author: string
                    available_copies: number
                    book_id: string
                    category_id: number | null
                    cover_image_url: string | null
                    created_at: string | null
                    description: string | null
                    isbn: string
                    location: string | null
                    publish_date: string | null
                    publisher: string | null
                    title: string
                    total_copies: number
                    updated_at: string | null
                }
                Insert: {
                    author: string
                    available_copies?: number
                    book_id?: string
                    category_id?: number | null
                    cover_image_url?: string | null
                    created_at?: string | null
                    description?: string | null
                    isbn: string
                    location?: string | null
                    publish_date?: string | null
                    publisher?: string | null
                    title: string
                    total_copies?: number
                    updated_at?: string | null
                }
                Update: {
                    author?: string
                    available_copies?: number
                    book_id?: string
                    category_id?: number | null
                    cover_image_url?: string | null
                    created_at?: string | null
                    description?: string | null
                    isbn?: string
                    location?: string | null
                    publish_date?: string | null
                    publisher?: string | null
                    title?: string
                    total_copies?: number
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "books_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["category_id"]
                    },
                ]
            }
            categories: {
                Row: {
                    category_id: number
                    created_at: string | null
                    description: string | null
                    name: string
                }
                Insert: {
                    category_id?: number
                    created_at?: string | null
                    description?: string | null
                    name: string
                }
                Update: {
                    category_id?: number
                    created_at?: string | null
                    description?: string | null
                    name?: string
                }
                Relationships: []
            }
            loans: {
                Row: {
                    book_id: string | null
                    checkout_date: string | null
                    created_at: string | null
                    due_date: string
                    fine_amount: number | null
                    loan_id: string
                    return_date: string | null
                    status: string | null
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    book_id?: string | null
                    checkout_date?: string | null
                    created_at?: string | null
                    due_date: string
                    fine_amount?: number | null
                    loan_id?: string
                    return_date?: string | null
                    status?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    book_id?: string | null
                    checkout_date?: string | null
                    created_at?: string | null
                    due_date?: string
                    fine_amount?: number | null
                    loan_id?: string
                    return_date?: string | null
                    status?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "loans_book_id_fkey"
                        columns: ["book_id"]
                        isOneToOne: false
                        referencedRelation: "books"
                        referencedColumns: ["book_id"]
                    },
                    {
                        foreignKeyName: "loans_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["user_id"]
                    },
                ]
            }
            reservations: {
                Row: {
                    book_id: string | null
                    created_at: string | null
                    reservation_date: string | null
                    reservation_id: string
                    status: string | null
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    book_id?: string | null
                    created_at?: string | null
                    reservation_date?: string | null
                    reservation_id?: string
                    status?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    book_id?: string | null
                    created_at?: string | null
                    reservation_date?: string | null
                    reservation_id?: string
                    status?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "reservations_book_id_fkey"
                        columns: ["book_id"]
                        isOneToOne: false
                        referencedRelation: "books"
                        referencedColumns: ["book_id"]
                    },
                    {
                        foreignKeyName: "reservations_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["user_id"]
                    },
                ]
            }
            reviews: {
                Row: {
                    book_id: string | null
                    comment: string | null
                    created_at: string | null
                    rating: number | null
                    review_id: string
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    book_id?: string | null
                    comment?: string | null
                    created_at?: string | null
                    rating?: number | null
                    review_id?: string
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    book_id?: string | null
                    comment?: string | null
                    created_at?: string | null
                    rating?: number | null
                    review_id?: string
                    updated_at?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "reviews_book_id_fkey"
                        columns: ["book_id"]
                        isOneToOne: false
                        referencedRelation: "books"
                        referencedColumns: ["book_id"]
                    },
                    {
                        foreignKeyName: "reviews_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["user_id"]
                    },
                ]
            }
            users: {
                Row: {
                    address: string | null
                    created_at: string | null
                    email: string
                    full_name: string
                    membership_type: string | null
                    password_hash: string
                    phone: string | null
                    updated_at: string | null
                    user_id: string
                    username: string
                }
                Insert: {
                    address?: string | null
                    created_at?: string | null
                    email: string
                    full_name: string
                    membership_type?: string | null
                    password_hash: string
                    phone?: string | null
                    updated_at?: string | null
                    user_id?: string
                    username: string
                }
                Update: {
                    address?: string | null
                    created_at?: string | null
                    email?: string
                    full_name?: string
                    membership_type?: string | null
                    password_hash?: string
                    phone?: string | null
                    updated_at?: string | null
                    user_id?: string
                    username?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            borrow_book:
                | {
                Args: {
                    book_id: number
                    user_id: string
                }
                Returns: boolean
            }
                | {
                Args: {
                    p_user_id: string
                    p_book_id: string
                    p_due_date: string
                }
                Returns: string
            }
            get_activity_data: {
                Args: {
                    time_range: string
                }
                Returns: {
                    name: string
                    loans: number
                    returns: number
                    new_users: number
                }[]
            }
            get_category_distribution: {
                Args: Record<PropertyKey, never>
                Returns: {
                    name: string
                    value: number
                }[]
            }
            get_loan_trends: {
                Args: {
                    days_num: number
                }
                Returns: {
                    date: string
                    loans: number
                }[]
            }
            get_popular_books: {
                Args: {
                    limit_num: number
                }
                Returns: {
                    title: string
                    loan_count: number
                }[]
            }
            get_user_dashboard_stats: {
                Args: {
                    user_id: string
                }
                Returns: {
                    totalbooks: number
                    borrowedbooks: number
                    overduebooks: number
                }[]
            }
            get_user_statistics: {
                Args: {
                    user_id: string
                }
                Returns: {
                    books_read: number
                    pages_read: number
                    average_rating: number
                }[]
            }
            reserve_book: {
                Args: {
                    book_id: number
                    user_id: string
                }
                Returns: boolean
            }
            return_book:
                | {
                Args: {
                    book_id: number
                    user_id: string
                }
                Returns: boolean
            }
                | {
                Args: {
                    p_loan_id: string
                }
                Returns: undefined
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
            | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
            Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
            PublicSchema["Views"])
        ? (PublicSchema["Tables"] &
            PublicSchema["Views"])[PublicTableNameOrOptions] extends {
                Row: infer R
            }
            ? R
            : never
        : never

export type TablesInsert<
    PublicTableNameOrOptions extends
            | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Insert: infer I
        }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
                Insert: infer I
            }
            ? I
            : never
        : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
            | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Update: infer U
        }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
                Update: infer U
            }
            ? U
            : never
        : never

export type Enums<
    PublicEnumNameOrOptions extends
            | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
        ? PublicSchema["Enums"][PublicEnumNameOrOptions]
        : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
            | keyof PublicSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
            schema: keyof Database
        }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
        ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
        : never
