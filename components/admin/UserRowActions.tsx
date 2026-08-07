'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UserRowActions({ userId, status }: { userId: string; status: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(newStatus: string) {
    setLoading(true);
    await supabase.from('users').update({ status: newStatus }).eq('id', userId);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-1.5">
      {status !== 'active' && (
        <button disabled={loading} onClick={() => setStatus('active')} className="btn-secondary !px-3 !py-1 text-xs">Aktifkan</button>
      )}
      {status !== 'muted' && (
        <button disabled={loading} onClick={() => setStatus('muted')} className="btn-secondary !px-3 !py-1 text-xs">Mute</button>
      )}
      {status !== 'banned' && (
        <button disabled={loading} onClick={() => setStatus('banned')} className="btn-danger !px-3 !py-1 text-xs">Ban</button>
      )}
    </div>
  );
}
