'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaTableColumns,
  FaArrowRightArrowLeft,
  FaBox,
  FaUsers,
  FaTriangleExclamation,
  FaGear,
} from 'react-icons/fa6';

const ITEMS = [
  { href: '/admin', label: 'Ringkasan', icon: FaTableColumns, exact: true },
  { href: '/admin/trades', label: 'Trade', icon: FaArrowRightArrowLeft },
  { href: '/admin/items', label: 'Item', icon: FaBox },
  { href: '/admin/users', label: 'User', icon: FaUsers },
  { href: '/admin/reports', label: 'Laporan', icon: FaTriangleExclamation },
  { href: '/admin/settings', label: 'Settings', icon: FaGear },
];

export default function AdminSidebar({ counts }: { counts: Record<string, number> }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-56 shrink-0">
        <nav className="sticky top-24 space-y-1.5">
          {ITEMS.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const count = counts[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm border-2 transition ${
                  active
                    ? 'bg-lure text-white border-foam shadow-brutal-sm'
                    : 'border-transparent text-seafoam hover:bg-white hover:border-foam hover:text-foam'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
                {!!count && (
                  <span className={`text-[11px] font-mono px-1.5 rounded ${active ? 'bg-white text-lure' : 'text-catch'}`}>
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile horizontal tab bar */}
      <nav className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border-2 border-foam transition ${
                active ? 'bg-lure text-white' : 'bg-white text-seafoam'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
