# Tabungan Dev 💎

**Tabungan Dev** adalah aplikasi manajemen keuangan dan pencatatan tabungan personal modern dengan desain **Apple Liquid Glass**, animasi fluid Framer Motion, grafik statistik interaktif, serta sinkronisasi database Supabase PostgreSQL & fallback LocalStorage.

---

## 🌟 Fitur Utama

- 🎨 **Apple Liquid Glass Design**: Tampilan ultra-premium dengan efek glassmorphism, aurora background, floating navigation, soft shadow, dan dark mode.
- 🔑 **Simple Auth (Username-Only)**: Masuk atau buat akun hanya dengan username tanpa ribet verifikasi email atau password.
- 📊 **Dashboard Finansial Real-time**: Ringkasan Total Saldo, Pemasukan, Pengeluaran, Quick Actions, dan grafik pergerakan keuangan.
- 💸 **Manajemen Transaksi**: Tambah, edit, hapus, filter kategori, pencarian fleksibel, dan pagination.
- 🎯 **Target Tabungan (Savings Goals)**: Set target tabungan, pelacakan persentase progres, akumulasi setoran/penarikan, estimasi hari selesai, dan selebrasi confetti!
- 📈 **Statistik Interaktif**: Pie Chart alokasi pengeluaran, Line Chart tren mingguan/bulanan, dan Bar Chart komparatif 7 hari / 30 hari / 1 tahun.
- 📂 **Export & Backup Data**:
  - Export Laporan ke CSV
  - Backup data lengkap ke JSON
  - Restore data dari JSON
  - Reset / Hapus Data Lokal
- 🌙 **Dark & Light Mode**: Dukungan tema otomatis atau manual dengan transisi halus.
- 🔄 **Dual Sync Engine**: Bekerja 100% offline via LocalStorage dan otomatis tersinkron ke Supabase saat kredensial dikonfigurasi.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **UI & Animations**: Framer Motion, Apple Liquid Glass Effects
- **State Management**: Zustand
- **Data Fetching & Cache**: TanStack React Query
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Forms & Validation**: React Hook Form, Zod
- **Theme**: next-themes
- **Effects**: Canvas Confetti

---

## 🚀 Cara Menjalankan Project

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Lintar-144hz/tabungan-dev.git
cd tabungan-dev
npm install
```

### 2. Konfigurasi Environment Variables

Buat file `.env.local` di root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> *Catatan: Jika `.env.local` tidak diisi, aplikasi akan tetap berjalan 100% lancar menggunakan mode LocalStorage.*

### 3. Setup Database Supabase (Opsional)

Eksekusi seluruh script SQL dari file `database.sql` pada SQL Editor di dashboard Supabase Anda.

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka browser dan akses [http://localhost:3000](http://localhost:3000).

---

## 📁 Struktur Directory

```
├── app/                  # Next.js App Router (Layouts & Pages)
├── components/           # Reusable UI & Glassmorphism Components
│   ├── dashboard/        # Dashboard Widgets & Charts
│   ├── goals/            # Savings Goals Modals & Cards
│   ├── layout/           # Floating Navigation & Aurora Wrapper
│   ├── settings/         # Backup, Theme & Export Options
│   ├── statistics/       # Recharts Analytics Cards
│   ├── transactions/     # Transaction Tables, Forms & Filters
│   └── ui/               # Primitive Glass Cards, Modals, Buttons
├── hooks/                # Custom React Hooks
├── lib/                  # Supabase Client, Storage Sync & Utilities
├── services/             # Database & Storage Abstraction Services
├── store/                # Zustand Auth & Financial State Stores
├── types/                # TypeScript Interfaces & Schemas
├── database.sql          # Supabase PostgreSQL Database Schema
└── README.md
```

---

## 📜 Lisensi

MIT License © 2026 Tabungan Dev
