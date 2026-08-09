import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FaUsers, FaBox, FaArrowRightArrowLeft, FaLink } from 'react-icons/fa6';
import AdminCharts from '@/components/admin/AdminCharts';
import { last14DaySeries } from '@/lib/chartData';

export default async function AdminOverviewPage() {
  const supabase = createClient();

  const [{ count: userCount }, { count: itemCount }, { data: trades }, { data: pool }, { data: usersForChart }] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('items').select('*', { count: 'exact', head: true }),
    supabase.from('trades').select('id, status, created_at'),
    supabase.from('ps_link_pool').select('id, status'),
    supabase.from('users').select('id, created_at'),
  ]);

  const activeTrades = trades?.filter((t) => !['completed', 'rejected', 'cancelled'].includes(t.status)).length ?? 0;
  const needsLink = trades?.filter((t) => t.status === 'confirmed').length ?? 0;
  const availableLinks = pool?.filter((p) => p.status === 'available').length ?? 0;

  const chartData = last14DaySeries(trades ?? [], usersForChart ?? []);

  const stats = [
    { label: 'Total User', value: userCount ?? 0, icon: FaUsers },
    { label: 'Total Item', value: itemCount ?? 0, icon: FaBox },
    { label: 'Trade Aktif', value: activeTrades, icon: FaArrowRightArrowLeft },
    { label: 'Link PS Tersedia', value: availableLinks, icon: FaLink },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl mb-1">Ringkasan</h1>
        <p className="text-seafoam text-sm">Pantauan cepat aktivitas ReelTrade.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4 flex items-start justify-between">
            <div>
              <p className="text-3xl font-display text-catch">{s.value}</p>
              <p className="text-seafoam text-sm mt-1">{s.label}</p>
            </div>
            <s.icon className="w-5 h-5 text-foam/30" />
          </div>
        ))}
      </div>

      <AdminCharts data={chartData} />

      {needsLink > 0 && (
        <div className="card p-5 border-catch bg-catch/5">
          <p className="font-display text-catch mb-1">
            {needsLink} trade menunggu link private server
          </p>
          <p className="text-seafoam text-sm mb-3">
            {availableLinks > 0
              ? 'Link biasanya ke-assign otomatis. Kalau masih nyangkut di sini, cek halaman Trade — mungkin di-confirm sebelum pool terisi.'
              : 'Stok link private server di pool lagi kosong, makanya belum ke-assign otomatis. Tambahin link baru di Settings.'}
          </p>
          <div className="flex gap-2">
            <Link href="/admin/trades" className="btn-secondary !py-1.5 text-sm">Lihat Trade</Link>
            <Link href="/admin/settings" className="btn-primary !py-1.5 text-sm">Isi Pool Link</Link>
          </div>
        </div>
      )}
    </div>
  );
}
