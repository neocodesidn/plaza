import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import MobileMenu from './MobileMenu';

// Mobile-only top bar. On md+ screens, AppSidebar handles navigation instead.
export default async function Navbar({ siteName }: { siteName: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role = 'user';
  let username = '';
  if (user) {
    const { data: profile } = await supabase.from('users').select('role, username').eq('id', user.id).single();
    role = profile?.role ?? 'user';
    username = profile?.username ?? '';
  }

  return (
    <header className="md:hidden border-b-2 border-foam bg-deep sticky top-0 z-40 relative">
      <div className="px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-foam">
          <span className="w-3 h-3 rounded-full bg-lure border-2 border-foam animate-bob" />
          {siteName}
        </Link>
        <MobileMenu loggedIn={!!user} role={role} username={username} />
      </div>
    </header>
  );
}
