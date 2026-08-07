import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SendPsLinkForm from '@/components/admin/SendPsLinkForm';
import MarkCompletedButton from '@/components/admin/MarkCompletedButton';
import UserRowActions from '@/components/admin/UserRowActions';

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: me } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (me?.role !== 'admin') redirect('/dashboard');

  const [{ data: allTrades }, { data: allUsers }, { data: reports }, { count: itemCount }] = await Promise.all([
    supabase
      .from('trades')
      .select('*, item_a:item_a_id(name), item_b:item_b_id(name), user_a:user_a_id(username), user_b:user_b_id(username)')
      .order('updated_at', { ascending: false }),
    supabase.from('users').select('*').order('created_at', { ascending: false }),
    supabase.from('reports').select('*, reporter:reporter_id(username), reported:reported_user_id(username)').eq('status', 'open').order('created_at', { ascending: false }),
    supabase.from('items').select('*', { count: 'exact', head: true }),
  ]);

  const activeTrades = allTrades?.filter((t) => !['completed', 'rejected', 'cancelled'].includes(t.status)) ?? [];
  const needsPsLink = allTrades?.filter((t) => t.status === 'confirmed') ?? [];

  const stats = [
    { label: 'Total User', value: allUsers?.length ?? 0 },
    { label: 'Total Item', value: itemCount ?? 0 },
    { label: 'Trade Aktif', value: activeTrades.length },
    { label: 'Perlu Link PS', value: needsPsLink.length },
  ];

  return (
    <div className="pt-8 space-y-12">
      <div>
        <h1 className="text-2xl mb-4">Admin Panel</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-4">
              <p className="text-3xl font-display text-catch">{s.value}</p>
              <p className="text-seafoam text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {needsPsLink.length > 0 && (
        <section>
          <h2 className="text-xl mb-3 text-catch">Perlu Dikirim Link Private Server</h2>
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

      <section>
        <h2 className="text-xl mb-3">Semua Trade</h2>
        <div className="space-y-2">
          {allTrades?.map((t: any) => (
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
      </section>

      {reports && reports.length > 0 && (
        <section>
          <h2 className="text-xl mb-3 text-danger">Laporan Terbuka</h2>
          <div className="space-y-2">
            {reports.map((r: any) => (
              <div key={r.id} className="card p-4 border-danger/40">
                <p className="text-sm">
                  <span className="text-foam">{r.reporter?.username}</span> melaporkan{' '}
                  <span className="text-foam">{r.reported?.username}</span>
                </p>
                <p className="text-seafoam text-sm mt-1">{r.reason}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl mb-3">Kelola User</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
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
