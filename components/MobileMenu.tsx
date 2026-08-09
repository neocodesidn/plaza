'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function MobileMenu({
  loggedIn,
  role,
  username,
}: {
  loggedIn: boolean;
  role: string;
  username: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const links = loggedIn
    ? [
        { href: '/dashboard', label: 'Item & Trade' },
        { href: '/chat', label: 'Global Chat' },
        ...(role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
      ]
    : [
        { href: '/login', label: 'Masuk' },
        { href: '/register', label: 'Daftar' },
      ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Buka menu"
        aria-expanded={open}
        className="p-2 -mr-2 text-foam focus:outline-none focus-visible:ring-2 focus-visible:ring-lure rounded-lg"
      >
        <div className="w-5 space-y-1.5">
          <span className={`block h-0.5 bg-foam transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 bg-foam transition ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 bg-foam transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-16 bg-deep border-b-2 border-foam px-4 py-4 space-y-1 z-50">
          {loggedIn && (
            <p className="text-seafoam/70 font-mono text-xs pb-2 border-b border-depth3 mb-2">@{username}</p>
          )}
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-2 py-2.5 rounded-lg text-sm transition ${
                pathname === l.href ? 'text-lure bg-lure/10' : 'text-foam hover:bg-depth2'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {loggedIn && (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setOpen(false);
                router.push('/');
                router.refresh();
              }}
              className="block w-full text-left px-2 py-2.5 rounded-lg text-sm text-danger hover:bg-danger/10 transition"
            >
              Keluar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
