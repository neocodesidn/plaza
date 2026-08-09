'use client';

import { useState } from 'react';

export default function SettingsTabs({
  tabs,
}: {
  tabs: { id: string; label: string; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto mb-5 -mx-4 px-4 md:mx-0 md:px-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`shrink-0 px-4 py-2 rounded-md text-sm border-2 border-foam transition ${
              active === t.id ? 'bg-lure text-white shadow-brutal-sm' : 'bg-white text-seafoam hover:text-foam'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.find((t) => t.id === active)?.content}
    </div>
  );
}
