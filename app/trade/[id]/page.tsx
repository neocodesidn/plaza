import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import ItemCard from '@/components/ItemCard';
import TradeActions from '@/components/TradeActions';
import TradeChat from '@/components/TradeChat';
import TradeLiveWatcher from '@/components/TradeLiveWatcher';

export default async function TradeDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: trade } = await supabase
    .from('trades')
    .select('*, item_a:item_a_id(*), item_b:item_b_id(*), user_a:user_a_id(username), user_b:user_b_id(username)')
    .eq('id', params.id)
    .single();

  if (!trade) notFound();
  if (trade.user_a_id !== user.id && trade.user_b_id !== user.id) redirect('/dashboard');

  const isPurchase = trade.deal_type === 'purchase';
  const isUserA = trade.user_a_id === user.id;
  const myAccepted = isUserA ? trade.accepted_a : trade.accepted_b;

  const [{ data: messages }, { data: ps }, { data: participants }] = await Promise.all([
    supabase.from('trade_messages').select('*').eq('trade_id', trade.id).order('created_at', { ascending: true }),
    supabase.from('private_servers').select('*').eq('trade_id', trade.id).maybeSingle(),
    supabase.from('users').select('id, username').in('id', [trade.user_a_id, trade.user_b_id]),
  ]);

  const usernames: Record<string, string> = {};
  participants?.forEach((p) => { usernames[p.id] = p.username; });

  return (
    <div className="pt-8 space-y-6">
      <TradeLiveWatcher tradeId={trade.id} />
      <div>
        <h1 className="text-2xl">
          {isPurchase ? 'Pembelian' : 'Trade'}: {trade.user_a.username} ↔ {trade.user_b.username}
        </h1>
        <span className="tag-rarity border-lure text-lure mt-1 inline-block">{trade.status}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        {isPurchase ? (
          <div className="card flex flex-col items-center justify-center p-6 text-center">
            <p className="text-seafoam text-xs mb-1">Dibayar</p>
            <p className="font-display text-2xl text-catch">Rp {Number(trade.price ?? 0).toLocaleString('id-ID')}</p>
            <p className="text-seafoam text-xs mt-1">oleh {trade.user_a.username}</p>
          </div>
        ) : (
          <ItemCard item={trade.item_a} />
        )}
        <ItemCard item={trade.item_b} />
      </div>

      <TradeActions tradeId={trade.id} isUserA={isUserA} myAccepted={myAccepted} status={trade.status} isPurchase={isPurchase} />

      {ps && (
        <div className="card p-4 border-catch">
          <p className="text-catch font-display mb-1">Link Private Server</p>
          <a href={ps.link} target="_blank" rel="noopener noreferrer" className="text-lure underline break-all">{ps.link}</a>
          <p className="text-seafoam text-xs mt-1">Dikirim otomatis begitu kalian berdua setuju — ketemuan di sini buat selesain {isPurchase ? 'pembayaran' : 'trade'} in-game.</p>
        </div>
      )}

      {trade.status === 'confirmed' && !ps && (
        <div className="card p-4">
          <p className="text-seafoam text-sm">Link private server lagi disiapin, muncul otomatis di sini sebentar lagi...</p>
        </div>
      )}

      <div>
        <h2 className="text-lg mb-2">Chat {isPurchase ? 'Pembelian' : 'Trade'}</h2>
        <TradeChat tradeId={trade.id} myId={user.id} initialMessages={messages ?? []} usernames={usernames} />
      </div>
    </div>
  );
}
