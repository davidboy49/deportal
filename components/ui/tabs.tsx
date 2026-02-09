'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Tabs({
  tabs,
}: {
  tabs: { key: string; label: string; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.key);
  const selected = tabs.find((t) => t.key === active);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium',
              active === tab.key ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{selected?.content}</div>
    </div>
  );
}
