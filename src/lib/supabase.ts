import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !anonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
}

// Anon client. Row Level Security in the database decides what this can read.
export const supabase = createClient(url, anonKey)

export type Product = {
  id: string; title: string; subtitle: string | null; slug: string
  price: number; sale_price: number | null; brand: string | null
}
export type ThemeTokens = {
  colors?: { bg?: string; surface?: string; primary?: string; text?: string; muted?: string }
  font?: { heading?: string; body?: string }; radius?: number; blur?: number
}
