import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from './LogoutButton';
import SidebarNavLink from './SidebarNavLink';
import { FaHouse, FaBoxOpen, FaComments, FaGaugeHigh } from 'react-icons/fa6';

export default async function AppSidebar({ siteName }: { siteName: string }) {
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
    <aside className="hidden md:flex md:w-60 shrink-0 border-r-2 border-foam bg-deep flex-col sticky top-0 h-screen">
      <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-foam px-5 h-16 border-b-2 border-foam shrink-0">
        <span className="w-3 h-3 rounded-full bg-lure border-2 border-foam animate-bob" />
        {siteName}
      </Link>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <SidebarNavLink href="/" icon={<FaHouse className="w-4 h-4 shrink-0" />} exact>Beranda</SidebarNavLink>
        {user && (
          <>
            <SidebarNavLink href="/dashboard" icon={<FaBoxOpen className="w-4 h-4 shrink-0" />}>Item &amp; Trade</SidebarNavLink>
            <SidebarNavLink href="/chat" icon={<FaComments className="w-4 h-4 shrink-0" />}>Global Chat</SidebarNavLink>
            {role === 'admin' && (
              <SidebarNavLink href="/admin" icon={<FaGaugeHigh className="w-4 h-4 shrink-0" />} accent>Admin</SidebarNavLink>
            )}
          </>
        )}
      </nav>

      <div className="p-3 border-t-2 border-foam shrink-0">
        {user ? (
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-seafoam font-mono text-xs truncate">@{username}</span>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-1">
            <Link href="/login" className="btn-secondary text-center !py-1.5 text-sm">Masuk</Link>
            <Link href="/register" className="btn-primary text-center !py-1.5 text-sm">Daftar</Link>
          </div>
        )}
      </div>
    </aside>
  );
}
