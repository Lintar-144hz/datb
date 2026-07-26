-- =============================================
-- TABUNGAN DEV - SUPABASE POSTGRESQL SCHEMA
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLE: USERS
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast username lookup
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- 2. TABLE: CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Tag',
  color TEXT NOT NULL DEFAULT '#7C3AED',
  type TEXT NOT NULL DEFAULT 'expense', -- 'income' or 'expense'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_user ON public.categories(user_id);

-- 3. TABLE: TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- 4. TABLE: GOALS
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target NUMERIC(15, 2) NOT NULL DEFAULT 0,
  current NUMERIC(15, 2) NOT NULL DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goals_user ON public.goals(user_id);

-- Enable Row Level Security (RLS) & Policies for Anon Key Access
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Allow anon public access for single-tenant / username app model
CREATE POLICY "Allow anon all on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on goals" ON public.goals FOR ALL USING (true) WITH CHECK (true);

-- FUNCTION: Seed Default Categories for New Users
CREATE OR REPLACE FUNCTION public.seed_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.categories (user_id, name, icon, color, type) VALUES
    (NEW.id, 'Gaji & Pendapatan', 'Wallet', '#10B981', 'income'),
    (NEW.id, 'Bonus & Investasi', 'TrendingUp', '#06B6D4', 'income'),
    (NEW.id, 'Penjualan / Side Hustle', 'Briefcase', '#3B82F6', 'income'),
    (NEW.id, 'Makanan & Minuman', 'Utensils', '#F59E0B', 'expense'),
    (NEW.id, 'Belanja & Groceries', 'ShoppingBag', '#EC4899', 'expense'),
    (NEW.id, 'Transportasi & Bensin', 'Car', '#8B5CF6', 'expense'),
    (NEW.id, 'Tagihan & Utilitas', 'Zap', '#EF4444', 'expense'),
    (NEW.id, 'Hiburan & Hobi', 'Film', '#6366F1', 'expense'),
    (NEW.id, 'Kesehatan & Medis', 'HeartPulse', '#14B8A6', 'expense'),
    (NEW.id, 'Edukasi & Buku', 'GraduationCap', '#F97316', 'expense');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: Auto-seed categories on user insert
DROP TRIGGER IF EXISTS trigger_seed_categories ON public.users;
CREATE TRIGGER trigger_seed_categories
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.seed_default_categories();
