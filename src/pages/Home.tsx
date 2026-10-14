import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, type Product, type ThemeTokens } from '../lib/supabase'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [theme, setTheme] = useState<ThemeTokens>({})
  const [announcement, setAnnouncement] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    // LIVE data: only 'active' products and 'published' theme are readable thanks to RLS.
    supabase.from('products').select('id,title,subtitle,slug,price,sale_price,brand')
      .order('created_at', { ascending: false }).limit(12)
      .then(({ data, error }) => error ? setErr(error.message) : setProducts(data ?? []))

    supabase.from('theme_tokens').select('tokens').eq('state', 'published').single()
      .then(({ data }) => data?.tokens && setTheme(data.tokens))

    supabase.from('store_settings').select('value').eq('key', 'announcement').single()
      .then(({ data }) => { const a = data?.value as any; a?.enabled && setAnnouncement(a.text) })
  }, [])

  const c = theme.colors ?? {}
  return (
    <div style={{ background: c.bg ?? '#0a0a0f', color: c.text ?? '#f5f5f7', fontFamily: theme.font?.body }}>
      <div className="gradient-orb" style={{ background: c.primary ?? '#8b7bff', width: 480, height: 480, top: -120, left: -100 }} />
      <div className="gradient-orb" style={{ background: '#4dd0e1', width: 380, height: 380, top: 200, right: -80 }} />

      {announcement && (
        <div className="py-2 text-center text-sm" style={{ background: (c.primary ?? '#8b7bff') + '33' }}>{announcement}</div>
      )}

      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center">
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight" style={{ fontFamily: theme.font?.heading }}>
          Kini Gama
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}
          className="mx-auto mt-4 max-w-xl text-lg opacity-70">
          A premium storefront, live from your Supabase database.
        </motion.p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        {err && <p className="text-red-400">Error: {err}</p>}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass glass-hover rounded-3xl p-5">
              <div className="mb-4 h-40 rounded-2xl bg-white/5 flex items-center justify-center text-4xl">◈</div>
              <p className="text-xs uppercase tracking-widest opacity-50">{p.brand ?? 'Kini Gama'}</p>
              <h3 className="mt-1 font-semibold">{p.title}</h3>
              <p className="mt-2 font-medium" style={{ color: c.primary ?? '#8b7bff' }}>
                ₹{Number(p.sale_price ?? p.price).toLocaleString('en-IN')}
                {p.sale_price && <span className="ml-2 text-sm opacity-40 line-through">₹{Number(p.price).toLocaleString('en-IN')}</span>}
              </p>
            </motion.div>
          ))}
        </div>
        {products.length === 0 && !err && (
          <p className="glass mx-auto max-w-md rounded-2xl p-6 text-center opacity-70">
            No products yet. Log in to <a href="/admin" className="underline">/admin</a> and publish your first product!
          </p>
        )}
      </section>
    </div>
  )
}
