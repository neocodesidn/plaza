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

# ReelTrade — Platform Trade Item Fish It

Website trade item game **Fish It** (Roblox) dengan sistem login/register, ajukan trade
2-arah, chat privat per-trade, global chat realtime, dan admin panel (dengan sidebar)
buat kelola link private server otomatis + monitoring. 100% pakai layanan gratisan:
**Next.js di Vercel** + **Supabase** (database, auth, realtime, storage).

Desain pakai palet terang ala Claude (cream + clay/terracotta) — bukan dark mode.

## 1. Setup Supabase (gratis)

1. Bikin akun & project baru di [supabase.com](https://supabase.com) (pilih region Singapore biar deket).
2. Buka **SQL Editor**, copy-paste seluruh isi file `supabase/schema.sql`, lalu **Run**.
   Ini bakal bikin semua tabel, trigger, dan RLS policy sekaligus — termasuk pool link
   private server dan sistem auto-assign.
   - **Sudah pernah run schema versi lama?** Jangan run `schema.sql` ulang — cukup run
     `supabase/migration_v2.sql` sekali aja, itu nambahin fitur baru (pool link, settings,
     storage policy) tanpa ganggu data yang udah ada.
3. Buka **Storage** → bikin bucket baru namanya `item-images`, set jadi **Public bucket**.
4. Buka **Project Settings > API**, catat 3 value ini:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` / `Publishable` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` / `Secret` key → `SUPABASE_SERVICE_ROLE_KEY` (rahasia, jangan disebar)
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

# ReelTrade — Platform Trade Item Fish It

Website trade item game **Fish It** (Roblox): login/register (dilindungi Cloudflare
Turnstile + "ingat saya 30 hari"), trade 2-arah, chat privat & global realtime, link
private server otomatis, dan admin panel gaya dashboard (mirip TailAdmin) dengan tema
**neo-brutalism** — border tebal, bayangan solid offset, tanpa gradient lembut.
100% gratisan: **Next.js di Vercel** + **Supabase**.

## 1. Setup Supabase

1. Bikin project di [supabase.com](https://supabase.com) (region Singapore).
2. **Project baru?** Run `supabase/schema.sql` di SQL Editor, sekali aja.
   **Udah pernah setup sebelumnya?** Run migration sesuai urutan yang belum pernah
   dijalanin: `migration_v2.sql` lalu `migration_v3.sql`. Aman dijalanin ulang.
3. Storage → bucket baru `item-images`, **Public bucket**.
4. Project Settings > API, catat: `Project URL`, `anon`/`Publishable` key,
   `service_role`/`Secret` key.
5. Register akun biasa lewat website, lalu di Table Editor → tabel `users`, ubah
   `role` jadi `admin` buat akun lo. Refresh, buka `/admin`.

## 2. Env variables

```bash
cp .env.example .env.local
```

Isi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` dari step Supabase. `TURNSTILE_SECRET_KEY` opsional —
lihat bagian Captcha di bawah.

```bash
npm install
npm run dev
```

## 3. Deploy ke Vercel

Push ke GitHub → import di [vercel.com](https://vercel.com) → isi Environment
Variables yang sama → Deploy.

## Semua bisa dikustomisasi dari `/admin/settings` — tanpa deploy ulang

| Tab | Isinya |
|---|---|
| **Website** | Nama situs, judul & subjudul halaman utama, kontak, mode maintenance |
| **Tampilan** | Warna utama & sekunder (color picker) — langsung ganti tema di seluruh situs |
| **Ads (Adsterra)** | Tempel script iklan buat slot header & footer |
| **Keamanan** | Site key Cloudflare Turnstile buat captcha login/register |
| **Link Private Server** | Stok link yang di-assign otomatis ke trade yang confirmed |

### Captcha (Cloudflare Turnstile)

1. Bikin widget di [Cloudflare Turnstile dashboard](https://dash.cloudflare.com) → catat **Site Key** dan **Secret Key**.
2. **Site Key** → paste di `/admin/settings` tab Keamanan (aman untuk publik, dipakai di browser).
3. **Secret Key** → set sebagai environment variable `TURNSTILE_SECRET_KEY` di Vercel
   (jangan ditaruh di database, karena harus tetap rahasia di server).
4. Kosongkan Site Key kalau mau matiin captcha — form login/register otomatis jalan tanpa Turnstile.

### "Ingat saya 30 hari"

Checkbox di halaman login mengatur umur cookie sesi (30 hari kalau dicentang, session
cookie biasa kalau tidak). Ini berlaku di atas pengaturan sesi global Supabase — kalau
mau ubah timeout/inactivity global untuk semua user, itu diatur di Supabase Dashboard →
Authentication → Sessions.

### Ads (Adsterra atau jaringan lain)

Tempel script `<script>...</script>` yang dikasih Adsterra ke kolom Header/Footer di
tab Ads. Sistem otomatis mengeksekusi script itu di halaman (bukan sekadar nampilin
teksnya) — tinggal paste, gak perlu edit kode.

## Alur pemakaian

1. **User daftar/login** → captcha (kalau diaktifkan) → confirm email dari Supabase Auth.
2. **Upload item** di `/dashboard` — drag & drop gambar (atau klik buat pilih file),
   isi nama, kategori, rarity, dan **RAP** (Recent Average Price, opsional).
3. **Ajukan trade** ke item user lain.
4. Kedua user klik **Setuju Trade** di `/trade/[id]` → status otomatis `confirmed`.
5. **Sistem otomatis** ambil 1 link dari pool (`/admin/settings` tab Link Private
   Server) dan kirim ke halaman trade — realtime, gak perlu refresh, gak perlu admin
   klik apa-apa. Kalau pool kosong, admin bisa kirim manual per-trade di `/admin/trades`.
6. Admin klik **Tandai Selesai** setelah trade kelar in-game.
7. **Global chat** di `/chat` — admin bisa hapus pesan & mute/ban user dari `/admin/users`.

## Admin panel (`/admin`)

Layout sidebar dengan 6 halaman: **Ringkasan** (stat + grafik trade & user 14 hari
terakhir), **Trade**, **Item** (RAP ditampilin, bisa dihapus), **User** (mute/ban),
**Laporan**, dan **Settings** (5 tab seperti tabel di atas). Ikon pakai FontAwesome
(`react-icons/fa6`), grafik pakai `recharts`.

## Struktur folder penting

```
app/
  login/ register/          -> auth (Turnstile + remember-me, lewat API route)
  api/auth/login, register/  -> route handler: verifikasi captcha + kontrol cookie sesi
  dashboard/                  -> item saya (drag&drop upload + RAP), browse, trade
  trade/[id]/                 -> detail trade + chat privat + link PS (realtime)
  chat/                       -> global chat
  admin/                      -> layout sidebar + ringkasan(chart), trades, items, users, reports, settings(tabs)
components/                   -> UI + logic client-side
  admin/                      -> komponen khusus admin panel
lib/
  supabase/                    -> client, server, admin (service role) client
  turnstile.ts                 -> verifikasi token Turnstile ke Cloudflare
  color.ts                     -> hex → RGB channel (buat CSS var tema dinamis)
  chartData.ts                 -> agregasi data 14 hari buat grafik admin
middleware.ts                  -> proteksi route (harus login, admin-only utk /admin)
supabase/schema.sql             -> full schema — buat project baru
supabase/migration_v2.sql       -> delta: pool link otomatis, storage policy
supabase/migration_v3.sql       -> delta: RAP, konten/tema/ads/captcha yang bisa diatur
```

## Catatan soal link private server

Roblox gak nyediain API publik buat generate link private server otomatis untuk game
yang bukan milik lo. Jadi "otomatis" di sini artinya: admin nyiapin **stok link** di
Settings, lalu **sistem yang assign otomatis** satu-satu ke trade begitu confirmed.

## Catatan keamanan

- Semua akses data diproteksi **Row Level Security (RLS)** di Supabase — user cuma
  bisa baca/tulis data trade & chat yang dia terlibat di dalamnya.
- `SUPABASE_SERVICE_ROLE_KEY` cuma dipakai server-side, jangan pernah taruh di
  kode yang jalan di browser.
- Rate limit / captcha di form login-register belum ada — kalau mau lebih aman
  dari bot, aktifkan **CAPTCHA** di Supabase Auth settings (gratis, tinggal toggle).


- Semua akses data diproteksi **Row Level Security (RLS)** di Supabase — user cuma
  bisa baca/tulis data trade & chat yang dia terlibat di dalamnya.
- `SUPABASE_SERVICE_ROLE_KEY` cuma dipakai server-side, jangan pernah taruh di
  kode yang jalan di browser.
- Rate limit / captcha di form login-register belum ada — kalau mau lebih aman
  dari bot, aktifkan **CAPTCHA** di Supabase Auth settings (gratis, tinggal toggle).
