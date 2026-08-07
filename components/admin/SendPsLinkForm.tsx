'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SendPsLinkForm({ tradeId, adminId }: { tradeId: string; adminId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!link.trim()) return;
    setLoading(true);
    setError('');

    const { error: psError } = await supabase.from('private_servers').insert({ trade_id: tradeId, link, sent_by: adminId });
    if (psError) {
      setError(psError.message);
      setLoading(false);
      return;
    }
    await supabase.from('trades').update({ status: 'ps_sent' }).eq('id', tradeId);

    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSend} className="flex gap-2 mt-2">
      <input className="input !py-1.5 text-sm" placeholder="https://www.roblox.com/games/.../private-server-link" value={link} onChange={(e) => setLink(e.target.value)} />
      <button className="btn-primary !py-1.5 text-sm" disabled={loading}>{loading ? '...' : 'Kirim Link PS'}</button>
      {error && <p className="text-danger text-xs self-center">{error}</p>}
    </form>
  );
}
