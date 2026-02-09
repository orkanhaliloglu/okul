'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Review = {
    id: string
    user_name: string
    rating: number
    comment: string
    created_at: string
}

export async function submitReview(formData: FormData) {
    const name = formData.get('name') as string
    const rating = parseInt(formData.get('rating') as string)
    const comment = formData.get('comment') as string

    if (!name || !rating || !comment) {
        return { success: false, error: 'Lütfen tüm alanları doldurunuz.' }
    }

    try {
        const { error } = await supabase
            .from('site_reviews')
            .insert([
                {
                    user_name: name,
                    rating: rating,
                    comment: comment,
                    is_approved: true // Auto-approve for now
                }
            ])

        if (error) throw error

        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error submitting review:', error)
        return { success: false, error: 'Yorum gönderilirken bir hata oluştu.' }
    }
}

export async function getRecentReviews() {
    try {
        const { data, error } = await supabase
            .from('site_reviews')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
            .limit(10)

        if (error) throw error
        return data as Review[]
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return []
    }
}
