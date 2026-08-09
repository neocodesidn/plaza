-- ============================================================
-- MIGRATION v3 — run this after migration_v2.sql (or after
-- schema.sql if this is your first migration).
-- Adds: RAP field on items, and site_settings keys for
-- editable hero text, theme colors, ad scripts, and Turnstile.
-- Safe to run multiple times.
-- ============================================================

alter table public.items add column if not exists rap integer not null default 0;

insert into public.site_settings (key, value) values
  ('hero_title', 'Tukeran item Fish It tanpa takut kena tipu.'),
  ('hero_subtitle', 'Ajukan trade, ngobrol langsung sama lawan trade lo, dan kalau berdua udah setuju — link private server dikirim otomatis biar kalian ketemu di dalam game.'),
  ('theme_primary', '#D97757'),
  ('theme_secondary', '#B4762F'),
  ('ads_header_script', ''),
  ('ads_footer_script', ''),
  ('turnstile_site_key', '')
on conflict (key) do nothing;
