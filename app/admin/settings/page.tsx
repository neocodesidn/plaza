import { createClient } from '@/lib/supabase/server';
import SettingsSection from '@/components/admin/SettingsSection';
import SettingsTabs from '@/components/admin/SettingsTabs';
import PsLinkPoolManager from '@/components/admin/PsLinkPoolManager';

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: settingsRows }, { data: poolLinks }] = await Promise.all([
    supabase.from('site_settings').select('*'),
    supabase.from('ps_link_pool').select('*').order('created_at', { ascending: true }),
  ]);

  const values: Record<string, string> = {};
  settingsRows?.forEach((r) => { values[r.key] = r.value; });

  const tabs = [
    {
      id: 'content',
      label: 'Website',
      content: (
        <SettingsSection
          values={values}
          fields={[
            { key: 'site_name', label: 'Nama Website', type: 'text', placeholder: 'ReelTrade' },
            { key: 'hero_title', label: 'Judul Halaman Utama', type: 'text', placeholder: 'Tukeran item Fish It tanpa takut kena tipu.' },
            { key: 'hero_subtitle', label: 'Subjudul Halaman Utama', type: 'textarea' },
            { key: 'contact_info', label: 'Kontak / Bantuan', type: 'text', placeholder: 'support@reeltrade.id atau link WhatsApp' },
            { key: 'maintenance_mode', label: 'Mode maintenance (nonaktifin sementara buat user biasa)', type: 'checkbox' },
          ]}
        />
      ),
    },
    {
      id: 'appearance',
      label: 'Tampilan',
      content: (
        <SettingsSection
          values={values}
          fields={[
            { key: 'theme_primary', label: 'Warna Utama (tombol, aksen)', type: 'color', help: 'Default: clay/terracotta seperti brand Claude.' },
            { key: 'theme_secondary', label: 'Warna Sekunder (rarity legendary, highlight)', type: 'color' },
          ]}
        />
      ),
    },
    {
      id: 'ads',
      label: 'Ads (Adsterra)',
      content: (
        <SettingsSection
          values={values}
          fields={[
            {
              key: 'ads_header_script',
              label: 'Script Iklan — Header (di atas navbar/konten)',
              type: 'textarea',
              placeholder: '<script type="text/javascript" ...>...</script>',
              help: 'Paste script Adsterra (atau jaringan iklan lain) di sini. Kosongkan kalau tidak dipakai.',
            },
            {
              key: 'ads_footer_script',
              label: 'Script Iklan — Footer (di bawah konten)',
              type: 'textarea',
              placeholder: '<script type="text/javascript" ...>...</script>',
            },
          ]}
        />
      ),
    },
    {
      id: 'security',
      label: 'Keamanan',
      content: (
        <div className="space-y-4">
          <SettingsSection
            values={values}
            fields={[
              {
                key: 'turnstile_site_key',
                label: 'Cloudflare Turnstile — Site Key',
                type: 'text',
                placeholder: '0x4AAAAAAA...',
                help: 'Ambil dari dashboard Cloudflare Turnstile. Kosongkan untuk mematikan captcha di login/register.',
              },
            ]}
          />
          <div className="card p-5">
            <p className="font-display text-sm mb-2">Catatan setup captcha & sesi login</p>
            <ul className="text-seafoam text-sm space-y-1.5 list-disc pl-4">
              <li>
                <span className="text-foam">Secret Key</span> Turnstile harus diisi lewat environment variable
                <code className="mx-1 font-mono text-xs bg-deep border border-depth3 px-1 rounded">TURNSTILE_SECRET_KEY</code>
                di Vercel (bukan di sini), karena harus tetap rahasia di server.
              </li>
              <li>
                Panjang sesi login global (misal timeout tidak aktif) diatur di Supabase Dashboard →
                Authentication → Sessions. Checkbox "Ingat saya 30 hari" di halaman login mengatur
                cookie sesi per-user di atas pengaturan itu.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'ps-pool',
      label: 'Link Private Server',
      content: (
        <div className="space-y-3">
          <p className="text-seafoam text-sm">
            Begitu 2 user setuju trade, sistem otomatis ambil 1 link dari sini dan kirim ke chat trade mereka —
            gak perlu klik apa-apa. Rajin isi ulang biar trade gak ketahan nunggu.
          </p>
          <PsLinkPoolManager links={poolLinks ?? []} adminId={user?.id ?? ''} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl mb-1">Settings</h1>
        <p className="text-seafoam text-sm">Semua teks, tampilan, iklan, dan keamanan website — bisa diubah dari sini tanpa deploy ulang.</p>
      </div>
      <SettingsTabs tabs={tabs} />
    </div>
  );
}
