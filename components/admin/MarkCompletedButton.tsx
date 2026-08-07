'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MarkCompletedButton({ tradeId }: { tradeId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await supabase.from('trades').update({ status: 'completed' }).eq('id', tradeId);
        setLoading(false);
        router.refresh();
      }}
      className="btn-secondary !py-1.5 text-sm"
    >
      Tandai Selesai
    </button>
  );
}
