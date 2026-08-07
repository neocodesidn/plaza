'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({
  href,
  children,
  accent = false,
}: {
  href: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg transition ${
        active
          ? accent ? 'text-catch bg-catch/10' : 'text-lure bg-lure/10'
          : accent ? 'text-catch/80 hover:text-catch' : 'text-seafoam hover:text-foam'
      }`}
    >
      {children}
    </Link>
  );
}
