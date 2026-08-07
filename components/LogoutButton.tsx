'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
      }}
      className="text-seafoam hover:text-danger transition"
    >
      Keluar
    </button>
  );
}
