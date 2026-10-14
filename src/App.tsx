import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App() {
  const [email, setEmail] = useState<string | null>(null)
  const nav = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user.email ?? null))
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a0f' }}>
      <header className="glass sticky top-0 z-10 flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight">Kini Gama</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="opacity-80 hover:opacity-100">Shop</Link>
          {email ? (
            <>
              <Link to="/admin" className="opacity-80 hover:opacity-100">Admin</Link>
              <button onClick={async () => { await supabase.auth.signOut(); nav('/') }}
                className="rounded-full bg-white/10 px-4 py-1.5 hover:bg-white/20">Sign out</button>
            </>
          ) : (
            <Link to="/login" className="rounded-full bg-white/10 px-4 py-1.5 hover:bg-white/20">Sign in</Link>
          )}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  )
}
