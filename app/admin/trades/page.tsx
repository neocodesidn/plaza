import { createClient } from '@/lib/supabase/server';
import MarkCompletedButton from '@/components/admin/MarkCompletedButton';
import SendPsLinkForm from '@/components/admin/SendPsLinkForm';
import { createClient as createServerClient } from '@/lib/supabase/server';

export default async function AdminTradesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: allTrades } = await supabase
    .from('trades')
    .select('*, item_a:item_a_id(name), item_b:item_b_id(name), user_a:user_a_id(username), user_b:user_b_id(username)')
    .order('updated_at', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl mb-1">Trade</h1>
      <p className="text-seafoam text-sm mb-5">Semua trade yang pernah dibuat, terbaru dulu.</p>

      {allTrades && allTrades.length > 0 ? (
        <div className="space-y-2">
          {allTrades.map((t: any) => (
            <div key={t.id} className="card p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-sm">
                  <span className="text-foam">{t.user_a?.username}</span> ({t.item_a?.name}) ⇄{' '}
                  <span className="text-foam">{t.user_b?.username}</span> ({t.item_b?.name})
                </div>
                <div className="flex items-center gap-2">
                  <span className="tag-rarity border-lure text-lure">{t.status}</span>
                  {t.status === 'ps_sent' && <MarkCompletedButton tradeId={t.id} />}
                </div>
              </div>
              {t.status === 'confirmed' && user && (
                <div className="mt-2 pt-2 border-t border-depth3">
                  <p className="text-xs text-catch mb-1">Pool link kosong saat trade ini confirmed — kirim manual:</p>
                  <SendPsLinkForm tradeId={t.id} adminId={user.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-seafoam text-sm">Belum ada trade sama sekali.</p>
      )}
    </div>
  );
}
