import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from './LogoutButton';

export default async function Navbar() {
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
    <header className="border-b border-depth3/60 bg-deep/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-foam">
          <span className="w-2.5 h-2.5 rounded-full bg-lure animate-bob" />
          ReelTrade
        </Link>

        {user ? (
          <nav className="flex items-center gap-4 text-sm font-body">
            <Link href="/dashboard" className="text-seafoam hover:text-foam transition">Item</Link>
            <Link href="/chat" className="text-seafoam hover:text-foam transition">Global Chat</Link>
            {role === 'admin' && (
              <Link href="/admin" className="text-catch hover:brightness-110 transition">Admin</Link>
            )}
            <span className="hidden md:inline text-seafoam/70 font-mono text-xs">@{username}</span>
            <LogoutButton />
          </nav>
        ) : (
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/login" className="btn-secondary !px-4 !py-1.5">Masuk</Link>
            <Link href="/register" className="btn-primary !px-4 !py-1.5">Daftar</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
