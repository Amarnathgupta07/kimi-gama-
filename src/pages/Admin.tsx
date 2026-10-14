import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    // Security note: this check is only for UX. Real enforcement is RLS in Postgres —
    // a non-admin physically cannot read drafts or write products.
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { nav('/login'); return }
      const { data: p } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (p?.role !== 'admin' && p?.role !== 'staff') { nav('/'); return }
      setRole(p.role); setLoading(false)
    })
  }, [nav])

  if (loading) return <div className="p-10 opacity-60">Checking permissions…</div>

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-1 opacity-60">Signed in as {role}</p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          ['Products', 'Add, edit and publish products — Stage 2'],
          ['Orders', 'View and manage orders — Stage 3'],
          ['Page Builder', 'Drag-and-drop editor — Stage 4'],
        ].map(([t, d]) => (
          <div key={t} className="glass glass-hover rounded-3xl p-6">
            <h3 className="font-semibold">{t}</h3>
            <p className="mt-1 text-sm opacity-60">{d}</p>
            <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs opacity-70">Coming in next stage</span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm opacity-50">
        Stage 1 complete: live storefront + auth + role-gated admin shell.
      </p>
    </div>
  )
}
