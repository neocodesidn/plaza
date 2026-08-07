# ReelTrade — Platform Trade Item Fish It

Website trade item game **Fish It** (Roblox) dengan sistem login/register, ajukan trade
2-arah, chat privat per-trade, global chat realtime, dan admin panel buat kirim link
private server + monitoring. 100% pakai layanan gratisan: **Next.js di Vercel** +
**Supabase** (database, auth, realtime, storage).

## 1. Setup Supabase (gratis)

1. Bikin akun & project baru di [supabase.com](https://supabase.com) (pilih region Singapore biar deket).
2. Buka **SQL Editor**, copy-paste seluruh isi file `supabase/schema.sql`, lalu **Run**.
   Ini bakal bikin semua tabel, trigger, dan RLS policy sekaligus.
3. Buka **Storage** → bikin bucket baru namanya `item-images`, set jadi **Public bucket**.
4. Buka **Project Settings > API**, catat 3 value ini:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (rahasia, jangan disebar)
5. **Bikin akun admin pertama:**
   - Register biasa lewat website (jadi user biasa dulu).
   - Di Supabase Dashboard → Table Editor → tabel `users`, cari row lo, ubah kolom
     `role` dari `user` jadi `admin`. Refresh, sekarang lo bisa akses `/admin`.

## 2. Jalanin di lokal

```bash
cp .env.example .env.local
# isi 3 value dari step Supabase di atas

npm install
npm run dev
```

Buka `http://localhost:3000`.

## 3. Deploy ke Vercel (gratis)

1. Push folder ini ke GitHub repo baru.
2. Buka [vercel.com](https://vercel.com) → **New Project** → import repo tadi.
3. Di **Environment Variables**, masukin 3 value yang sama kayak `.env.local`.
4. Deploy. Selesai — otomatis dapet domain `*.vercel.app`.

## Alur pemakaian

1. **User daftar/login** → confirm email dari Supabase Auth.
2. **Upload item** di halaman `/dashboard` (nama, kategori, rarity, foto).
3. **Ajukan trade** ke item milik user lain — pilih item lo yang ditawar.
4. Kedua user buka halaman `/trade/[id]`, masing-masing klik **Setuju Trade**.
   Begitu dua-duanya setuju, status otomatis jadi `confirmed` (trigger di database).
5. **Admin** buka `/admin`, liat daftar trade yang `confirmed`, isi link private
   server Roblox, klik **Kirim Link PS** → link muncul otomatis di halaman trade
   kedua user + status jadi `ps_sent`.
6. Setelah mereka ketemu & tuker item in-game, admin klik **Tandai Selesai**.
7. **Global chat** di `/chat` — semua user bisa chat, admin bisa hapus pesan &
   mute/ban user langsung dari panel admin.

## Struktur folder penting

```
app/
  login/ register/        -> auth
  dashboard/               -> item saya, browse item, daftar trade
  trade/[id]/              -> detail trade + chat privat + link PS
  chat/                    -> global chat
  admin/                   -> monitoring, kirim PS link, kelola user, laporan
components/                -> semua UI + logic client-side
lib/supabase/               -> client, server, admin (service role) client
middleware.ts               -> proteksi route (harus login, admin-only utk /admin)
supabase/schema.sql          -> semua tabel, trigger, RLS policy — tinggal run sekali
```

## Catatan keamanan

- Semua akses data diproteksi **Row Level Security (RLS)** di Supabase — user cuma
  bisa baca/tulis data trade & chat yang dia terlibat di dalamnya.
- `SUPABASE_SERVICE_ROLE_KEY` cuma dipakai server-side, jangan pernah taruh di
  kode yang jalan di browser.
- Rate limit / captcha di form login-register belum ada — kalau mau lebih aman
  dari bot, aktifkan **CAPTCHA** di Supabase Auth settings (gratis, tinggal toggle).
