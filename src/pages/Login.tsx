import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null); const [busy, setBusy] = useState(false)
  const nav = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) setMsg(error.message)
    else nav('/admin')
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <form onSubmit={submit} className="glass w-full max-w-sm rounded-3xl p-8 space-y-4">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <input className="w-full rounded-xl bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-400"
          placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        <input className="w-full rounded-xl bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-400"
          placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        {msg && <p className="text-sm text-red-400">{msg}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-violet-500 py-3 font-semibold hover:bg-violet-400 disabled:opacity-50">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
