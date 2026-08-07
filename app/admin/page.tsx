import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Users, Package, ArrowLeftRight, Send, AlertTriangle } from 'lucide-react';
import SendPsLinkForm from '@/components/admin/SendPsLinkForm';
import MarkCompletedButton from '@/components/admin/MarkCompletedButton';
import UserRowActions from '@/components/admin/UserRowActions';
import DeleteItemButton from '@/components/admin/DeleteItemButton';
import ReportActions from '@/components/admin/ReportActions';

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: me } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (me?.role !== 'admin') redirect('/dashboard');

  const [{ data: allTrades }, { data: allUsers }, { data: reports }, { data: allItems }] = await Promise.all([
    supabase
      .from('trades')
      .select('*, item_a:item_a_id(name), item_b:item_b_id(name), user_a:user_a_id(username), user_b:user_b_id(username)')
      .order('updated_at', { ascending: false }),
    supabase.from('users').select('*').order('created_at', { ascending: false }),
    supabase.from('reports').select('*, reporter:reporter_id(username), reported:reported_user_id(username)').order('created_at', { ascending: false }),
    supabase.from('items').select('*, owner:owner_id(username)').order('created_at', { ascending: false }),
  ]);

  const activeTrades = allTrades?.filter((t) => !['completed', 'rejected', 'cancelled'].includes(t.status)) ?? [];
  const needsPsLink = allTrades?.filter((t) => t.status === 'confirmed') ?? [];
  const openReports = reports?.filter((r) => r.status === 'open') ?? [];

  const stats = [
    { label: 'Total User', value: allUsers?.length ?? 0, icon: Users },
    { label: 'Total Item', value: allItems?.length ?? 0, icon: Package },
    { label: 'Trade Aktif', value: activeTrades.length, icon: ArrowLeftRight },
    { label: 'Perlu Link PS', value: needsPsLink.length, icon: Send },
  ];

  const sections = [
    { id: 'ps-link', label: 'Kirim Link PS', count: needsPsLink.length },
    { id: 'trades', label: 'Semua Trade', count: allTrades?.length ?? 0 },
    { id: 'reports', label: 'Laporan', count: openReports.length },
    { id: 'items', label: 'Semua Item', count: allItems?.length ?? 0 },
    { id: 'users', label: 'Kelola User', count: allUsers?.length ?? 0 },
  ];

  return (
    <div className="pt-8 space-y-12">
      <div>
        <h1 className="text-2xl mb-4">Admin Panel</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-4 flex items-start justify-between">
              <div>
                <p className="text-3xl font-display text-catch">{s.value}</p>
                <p className="text-seafoam text-sm mt-1">{s.label}</p>
              </div>
              <s.icon className="w-5 h-5 text-depth3" />
            </div>
          ))}
        </div>

        <nav className="flex flex-wrap gap-2 mt-5">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs font-mono px-3 py-1.5 rounded-full border border-depth3 text-seafoam hover:border-lure hover:text-lure transition"
            >
              {s.label} {s.count > 0 && <span className="text-catch">({s.count})</span>}
            </a>
          ))}
        </nav>
      </div>

      {needsPsLink.length > 0 && (
        <section id="ps-link" className="scroll-mt-20">
          <h2 className="text-xl mb-3 text-catch flex items-center gap-2">
            <Send className="w-4 h-4" /> Perlu Dikirim Link Private Server
          </h2>
          <div className="space-y-3">
            {needsPsLink.map((t: any) => (
              <div key={t.id} className="card p-4">
                <p className="text-sm">
                  <span className="text-foam">{t.user_a?.username}</span> ({t.item_a?.name}) ⇄{' '}
                  <span className="text-foam">{t.user_b?.username}</span> ({t.item_b?.name})
                </p>
                <SendPsLinkForm tradeId={t.id} adminId={user.id} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="trades" className="scroll-mt-20">
        <h2 className="text-xl mb-3">Semua Trade</h2>
        {allTrades && allTrades.length > 0 ? (
          <div className="space-y-2">
            {allTrades.map((t: any) => (
              <div key={t.id} className="card p-4 flex items-center justify-between flex-wrap gap-2">
                <div className="text-sm">
                  <span className="text-foam">{t.user_a?.username}</span> ({t.item_a?.name}) ⇄{' '}
                  <span className="text-foam">{t.user_b?.username}</span> ({t.item_b?.name})
                </div>
                <div className="flex items-center gap-2">
                  <span className="tag-rarity border-lure/50 text-lure">{t.status}</span>
                  {t.status === 'ps_sent' && <MarkCompletedButton tradeId={t.id} />}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-seafoam text-sm">Belum ada trade sama sekali.</p>
        )}
      </section>

      <section id="reports" className="scroll-mt-20">
        <h2 className="text-xl mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-danger" /> Laporan
        </h2>
        {reports && reports.length > 0 ? (
          <div className="space-y-2">
            {reports.map((r: any) => (
              <div key={r.id} className={`card p-4 ${r.status === 'open' ? 'border-danger/40' : 'opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    <span className="text-foam">{r.reporter?.username}</span> melaporkan{' '}
                    <span className="text-foam">{r.reported?.username}</span>
                  </p>
                  <span className="tag-rarity border-depth3 text-seafoam">{r.status}</span>
                </div>
                <p className="text-seafoam text-sm mt-1">{r.reason}</p>
                {r.status === 'open' && <ReportActions reportId={r.id} />}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-seafoam text-sm">Belum ada laporan.</p>
        )}
      </section>

      <section id="items" className="scroll-mt-20">
        <h2 className="text-xl mb-3">Semua Item</h2>
        {allItems && allItems.length > 0 ? (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-depth3 text-seafoam text-left">
                  <th className="p-3 font-normal">Item</th>
                  <th className="p-3 font-normal">Pemilik</th>
                  <th className="p-3 font-normal">Rarity</th>
                  <th className="p-3 font-normal">Status</th>
                  <th className="p-3 font-normal">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {allItems.map((it: any) => (
                  <tr key={it.id} className="border-b border-depth3/50 last:border-0">
                    <td className="p-3">{it.name}</td>
                    <td className="p-3 text-seafoam">{it.owner?.username}</td>
                    <td className="p-3 text-seafoam">{it.rarity}</td>
                    <td className="p-3">
                      <span className="tag-rarity border-lure/50 text-lure">{it.status}</span>
                    </td>
                    <td className="p-3"><DeleteItemButton itemId={it.id} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-seafoam text-sm">Belum ada item.</p>
        )}
      </section>

      <section id="users" className="scroll-mt-20">
        <h2 className="text-xl mb-3">Kelola User</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-depth3 text-seafoam text-left">
                <th className="p-3 font-normal">Username</th>
                <th className="p-3 font-normal">Role</th>
                <th className="p-3 font-normal">Status</th>
                <th className="p-3 font-normal">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {allUsers?.map((u: any) => (
                <tr key={u.id} className="border-b border-depth3/50 last:border-0">
                  <td className="p-3">{u.username}</td>
                  <td className="p-3 text-seafoam">{u.role}</td>
                  <td className="p-3">
                    <span className={`tag-rarity ${u.status === 'active' ? 'border-lure/50 text-lure' : 'border-danger/50 text-danger'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {u.role !== 'admin' && <UserRowActions userId={u.id} status={u.status} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
