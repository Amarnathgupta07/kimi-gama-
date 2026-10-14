# Kini Gama — Stage 1 Storefront

## Run locally
1. `npm install`
2. `cp .env.example .env` → paste your Supabase URL + anon key
3. `npm run dev` → open http://localhost:5173

## Deploy to Vercel (go live)
1. Push this folder to a GitHub repo
2. vercel.com → Add New → Project → Import repo (Vercel auto-detects Vite)
3. Environment Variables → add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
4. Deploy → you get a live URL like https://kini-gama.vercel.app

## Seed a test product (SQL Editor in Supabase)
insert into products (title, slug, price, status)
values ('Aura Ceramic Mug','aura-ceramic-mug',1299,'active');
→ refresh your site, it appears instantly. That is the live publishing loop.

## What works now
- Live storefront pulling products/theme/announcement from Supabase (RLS enforced)
- Email/password login
- /admin gated by role (real enforcement is database-level RLS)
