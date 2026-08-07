'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { Item } from './ItemCard';

export default function ProposeTradeButton({
  targetItem,
  myItems,
  myId,
}: {
  targetItem: Item;
  myItems: Item[];
  myId: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePropose() {
    if (!selected) return;
    setLoading(true);
    setError('');

    const { error: insertError } = await supabase.from('trades').insert({
      user_a_id: myId,
      user_b_id: targetItem.owner_id,
      item_a_id: selected,
      item_b_id: targetItem.id,
      status: 'pending',
    });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setOpen(false);
    router.push('/dashboard?tab=trades');
    router.refresh();
  }

  if (myItems.length === 0) {
    return <p className="text-xs text-seafoam/60">Upload item lo dulu buat bisa nawar trade.</p>;
  }

  if (!open) {
    return <button onClick={() => setOpen(true)} className="btn-secondary w-full !py-1.5 text-sm">Ajukan Trade</button>;
  }

  return (
    <div className="space-y-2">
      <select className="input !py-1.5 text-sm" value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Pilih item lo yang ditawar...</option>
        {myItems.map((it) => (
          <option key={it.id} value={it.id}>{it.name} ({it.rarity})</option>
        ))}
      </select>
      {error && <p className="text-danger text-xs">{error}</p>}
      <div className="flex gap-2">
        <button onClick={handlePropose} disabled={!selected || loading} className="btn-primary !py-1.5 text-sm flex-1">
          {loading ? '...' : 'Kirim'}
        </button>
        <button onClick={() => setOpen(false)} className="btn-secondary !py-1.5 text-sm">Batal</button>
      </div>
    </div>
  );
}
