# سوق.gg — Sooq.gg

Arabic gaming marketplace for the MENA region.  
Built with React + Vite + Supabase + Vercel.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your Supabase keys
cp .env.example .env
# Edit .env with your real keys from https://supabase.com

# 3. Run locally
npm run dev
```

Open http://localhost:5173

---

## 📁 Project Structure

```
src/
  pages/
    Home.jsx          ← Landing page
    Listings.jsx      ← Browse listings (with filters)
    ListingDetail.jsx ← Single listing + buy box
    Auth.jsx          ← Login / Register
    Cart.jsx          ← Cart + checkout
    Dashboard.jsx     ← Seller dashboard

  components/
    Navbar.jsx        ← Sticky nav with lang toggle + cart
    Footer.jsx        ← Footer with links

  context/
    LangContext.jsx   ← AR/EN translation system
    AuthContext.jsx   ← Supabase auth
    CartContext.jsx   ← Cart state

  lib/
    supabase.js       ← Supabase client + mock data

  index.css           ← Global design tokens + utility classes
```

---

## 🌐 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

---

## 🗃️ Supabase Schema (run in SQL editor)

```sql
-- Users profile (extends auth.users)
create table profiles (
  id uuid references auth.users primary key,
  username text unique,
  rating numeric default 5.0,
  total_sales int default 0,
  balance numeric default 0,
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- Games
create table games (
  id serial primary key,
  name text, name_ar text,
  tag_en text, tag_ar text,
  color text, img text,
  hot boolean default false
);

-- Listings
create table listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references profiles(id),
  game_id int references games(id),
  type_en text, type_ar text,
  price numeric,
  delivery text default 'instant',
  description_en text, description_ar text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references profiles(id),
  listing_id uuid references listings(id),
  qty int default 1,
  total numeric,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table listings enable row level security;
alter table orders enable row level security;
```

---

## 📋 Pages

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/listings/:category` | Browse listings with filters |
| `/listing/:id` | Single listing detail + buy |
| `/auth` | Login / Register |
| `/cart` | Cart + checkout |
| `/dashboard` | Seller dashboard |
