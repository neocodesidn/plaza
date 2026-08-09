-- ============================================================
-- MIGRATION v4 — jual-beli di samping trade barter.
-- Aman dijalanin ulang.
-- ============================================================

-- Item sekarang bisa dipasang sebagai "trade" (barter) atau "sell" (jual pakai harga)
alter table public.items add column if not exists listing_type text not null default 'trade'
  check (listing_type in ('trade', 'sell'));
alter table public.items add column if not exists price numeric;

-- Trade sekarang bisa berupa barter item-vs-item, ATAU pembelian (item_a_id kosong,
-- dibayar cash sejumlah `price`). Kolom item_a_id jadi boleh null.
alter table public.trades alter column item_a_id drop not null;
alter table public.trades add column if not exists deal_type text not null default 'trade'
  check (deal_type in ('trade', 'purchase'));
alter table public.trades add column if not exists price numeric;

-- Insert policy lama mensyaratkan auth.uid() = user_a_id, itu masih berlaku sama
-- untuk purchase (pembeli selalu user_a). Tidak perlu diubah.
