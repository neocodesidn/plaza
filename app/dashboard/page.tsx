import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ItemCard, { type Item } from '@/components/ItemCard';
import AddItemForm from '@/components/AddItemForm';
import ProposeTradeButton from '@/components/ProposeTradeButton';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: myItems }, { data: otherItems }, { data: trades }] = await Promise.all([
    supabase.from('items').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }),
    supabase.from('items').select('*').neq('owner_id', user.id).eq('status', 'available').order('created_at', { ascending: false }),
    supabase
      .from('trades')
      .select('*, item_a:item_a_id(name), item_b:item_b_id(name), user_a:user_a_id(username), user_b:user_b_id(username)')
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
      .order('updated_at', { ascending: false }),
  ]);

  return (
    <div className="pt-8 space-y-12">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl">Item Saya</h1>
          <AddItemForm userId={user.id} />
        </div>
        {myItems && myItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {myItems.map((item: Item) => <ItemCard key={item.id} item={item} />)}
          </div>
        ) : (
          <p className="text-seafoam text-sm">Belum ada item. Tambahin item Fish It lo buat mulai trade.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl mb-4">Trade Saya</h2>
        {trades && trades.length > 0 ? (
          <div className="space-y-2">
            {trades.map((t: any) => (
              <Link key={t.id} href={`/trade/${t.id}`} className="card p-4 flex items-center justify-between hover:border-lure transition">
                <div className="text-sm">
                  <span className="text-foam">{t.item_a?.name}</span>
                  <span className="text-seafoam mx-2">⇄</span>
                  <span className="text-foam">{t.item_b?.name}</span>
                  <span className="text-seafoam ml-2 text-xs">
                    ({t.user_a?.username} ↔ {t.user_b?.username})
                  </span>
                </div>
                <span className="tag-rarity border-lure text-lure">{t.status}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-seafoam text-sm">Belum ada trade aktif.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl mb-4">Browse Item Orang Lain</h2>
        {otherItems && otherItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {otherItems.map((item: Item) => (
              <ItemCard
                key={item.id}
                item={item}
                footer={<ProposeTradeButton targetItem={item} myItems={(myItems as Item[]) ?? []} myId={user.id} />}
              />
            ))}
          </div>
        ) : (
          <p className="text-seafoam text-sm">Belum ada item lain yang tersedia.</p>
        )}
      </section>
    </div>
  );
}
