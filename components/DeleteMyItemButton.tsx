'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteMyItemButton({ itemId, status }: { itemId: string; status: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (status !== 'available') {
    return <p className="text-[11px] text-seafoam/70">Gak bisa dihapus, item lagi ditrade.</p>;
  }

  async function handleDelete() {
    setLoading(true);
    await supabase.from('items').delete().eq('id', itemId);
    setLoading(false);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex gap-1.5">
        <button disabled={loading} onClick={handleDelete} className="btn-danger !px-3 !py-1 text-xs flex-1">
          {loading ? '...' : 'Yakin hapus'}
        </button>
        <button onClick={() => setConfirming(false)} className="btn-secondary !px-3 !py-1 text-xs">Batal</button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="btn-secondary w-full !py-1.5 text-xs hover:!border-danger hover:!text-danger">
      Hapus Item
    </button>
  );
}
