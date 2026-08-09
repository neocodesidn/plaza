'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarNavLink({
  href,
  icon,
  children,
  exact = false,
  accent = false,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  exact?: boolean;
  accent?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm border-2 transition ${
        active
          ? `${accent ? 'bg-catch' : 'bg-lure'} text-white border-foam shadow-brutal-sm`
          : 'border-transparent text-seafoam hover:bg-white hover:border-foam hover:text-foam'
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
