'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ReportActions({ reportId }: { reportId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(status: string) {
    setLoading(true);
    await supabase.from('reports').update({ status }).eq('id', reportId);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-1.5 mt-2">
      <button disabled={loading} onClick={() => setStatus('reviewed')} className="btn-secondary !px-3 !py-1 text-xs">
        Tandai Ditinjau
      </button>
      <button disabled={loading} onClick={() => setStatus('dismissed')} className="btn-secondary !px-3 !py-1 text-xs">
        Abaikan
      </button>
    </div>
  );
}
