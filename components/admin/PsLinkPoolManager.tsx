'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type PoolLink = { id: string; link: string; status: string; created_at: string };

export default function PsLinkPoolManager({ links, adminId }: { links: PoolLink[]; adminId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [bulk, setBulk] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const available = links.filter((l) => l.status === 'available');
  const assigned = links.filter((l) => l.status === 'assigned');

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const rows = bulk
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((link) => ({ link, added_by: adminId }));

    if (rows.length === 0) return;
    setLoading(true);
    setError('');

    const { error: insertError } = await supabase.from('ps_link_pool').insert(rows);

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setBulk('');
    router.refresh();
  }

  async function handleDelete(id: string) {
    await supabase.from('ps_link_pool').delete().eq('id', id);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleAdd} className="card p-5 space-y-3">
        <div>
          <label className="text-sm text-seafoam block mb-1">
            Tambah link private server (satu link per baris — sistem otomatis pakai satu per satu urut dari yang paling lama ditambahin)
          </label>
          <textarea
            className="input min-h-[110px] font-mono text-xs"
            placeholder={'https://www.roblox.com/games/xxxx/fish-it?privateServerLinkCode=...\nhttps://www.roblox.com/games/xxxx/fish-it?privateServerLinkCode=...'}
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
          />
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button className="btn-primary" disabled={loading || !bulk.trim()}>{loading ? 'Menambahkan...' : 'Tambah ke Pool'}</button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <p className="text-3xl font-display text-lure">{available.length}</p>
          <p className="text-seafoam text-sm mt-1">Link tersedia (belum dipakai)</p>
        </div>
        <div className="card p-4">
          <p className="text-3xl font-display text-catch">{assigned.length}</p>
          <p className="text-seafoam text-sm mt-1">Link sudah ke-assign ke trade</p>
        </div>
      </div>

      {available.length > 0 && (
        <div>
          <p className="font-display text-sm mb-2">Antrean link tersedia</p>
          <div className="card divide-y divide-depth3">
            {available.map((l) => (
              <div key={l.id} className="p-3 flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-seafoam truncate">{l.link}</span>
                <button onClick={() => handleDelete(l.id)} className="text-danger text-xs shrink-0 hover:underline">
                  hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
