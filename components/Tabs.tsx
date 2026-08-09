'use client';

import { useState } from 'react';

export default function Tabs({
  tabs,
  defaultTab,
}: {
  tabs: { id: string; label: string; count?: number; content: React.ReactNode }[];
  defaultTab?: string;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto mb-5 -mx-4 px-4 md:mx-0 md:px-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-md text-sm border-2 border-foam transition ${
              active === t.id ? 'bg-lure text-white shadow-brutal-sm' : 'bg-white text-seafoam hover:text-foam'
            }`}
          >
            {t.label}
            {!!t.count && (
              <span className={`text-[11px] font-mono px-1.5 rounded ${active === t.id ? 'bg-white text-lure' : 'text-catch'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {tabs.find((t) => t.id === active)?.content}
    </div>
  );
}
