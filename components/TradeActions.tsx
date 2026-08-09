'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TradeActions({
  tradeId,
  isUserA,
  myAccepted,
  status,
}: {
  tradeId: string;
  isUserA: boolean;
  myAccepted: boolean;
  status: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(fields: Record<string, any>) {
    setLoading(true);
    await supabase.from('trades').update(fields).eq('id', tradeId);
    setLoading(false);
    router.refresh();
  }

  if (status === 'confirmed' || status === 'ps_sent' || status === 'completed') {
    return <p className="text-lure text-sm">Trade sudah confirmed — link private server bakal muncul otomatis di bawah.</p>;
  }

  if (status === 'rejected' || status === 'cancelled') {
    return <p className="text-danger text-sm">Trade ini sudah {status === 'rejected' ? 'ditolak' : 'dibatalkan'}.</p>;
  }

  return (
    <div className="flex gap-2">
      {!myAccepted ? (
        <button
          disabled={loading}
          onClick={() => update(isUserA ? { accepted_a: true } : { accepted_b: true })}
          className="btn-primary"
        >
          Setuju Trade
        </button>
      ) : (
        <p className="text-lure text-sm self-center">Lo udah setuju, menunggu lawan trade...</p>
      )}
      <button disabled={loading} onClick={() => update({ status: 'rejected' })} className="btn-danger">
        Tolak
      </button>
    </div>
  );
}
