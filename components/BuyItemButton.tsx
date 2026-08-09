'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { Item } from './ItemCard';

export default function BuyItemButton({ targetItem, myId }: { targetItem: Item; myId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleBuy() {
    setLoading(true);
    setError('');

    const { error: insertError } = await supabase.from('trades').insert({
      user_a_id: myId,
      user_b_id: targetItem.owner_id,
      item_a_id: null,
      item_b_id: targetItem.id,
      deal_type: 'purchase',
      price: targetItem.price,
      status: 'pending',
      accepted_a: true, // pembeli otomatis "setuju" begitu klik beli
    });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    router.push('/dashboard?tab=trades');
    router.refresh();
  }

  return (
    <div className="space-y-1.5">
      <button onClick={handleBuy} disabled={loading} className="btn-primary w-full !py-1.5 text-sm">
        {loading ? '...' : `Beli — Rp ${targetItem.price?.toLocaleString('id-ID')}`}
      </button>
      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  );
}
