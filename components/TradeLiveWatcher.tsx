'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function TradeLiveWatcher({ tradeId }: { tradeId: string }) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel(`trade-watch-${tradeId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'trades', filter: `id=eq.${tradeId}` },
        () => router.refresh()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'private_servers', filter: `trade_id=eq.${tradeId}` },
        () => router.refresh()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeId]);

  return null;
}
