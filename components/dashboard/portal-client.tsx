'use client';

import { useMemo, useState, useTransition } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { trackOpenAction, toggleFavoriteAction } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export type PortalApp = {
  id: string;
  name: string;
  url: string;
  description: string;
  iconUrl: string | null;
  tags: string[];
  categoryId: string | null;
  categoryName: string;
  favorite: boolean;
};

export function PortalClient({ apps, categories, recents }: { apps: PortalApp[]; categories: string[]; recents: PortalApp[] }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return apps.filter((app) => {
      const searchable = `${app.name} ${app.description} ${app.tags.join(' ')}`.toLowerCase();
      const categoryOk = activeCategory === 'All' || app.categoryName === activeCategory;
      return categoryOk && searchable.includes(q);
    });
  }, [apps, activeCategory, query]);

  const grouped = filtered.reduce<Record<string, PortalApp[]>>((acc, app) => {
    acc[app.categoryName] ||= [];
    acc[app.categoryName].push(app);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm md:max-w-md"
          placeholder="Search by name, tag, or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {['All', ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-3 py-1 text-sm ${
                activeCategory === category ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {!!recents.length && (
        <Card>
          <h2 className="mb-2 font-semibold">Recently Opened</h2>
          <div className="flex flex-wrap gap-2">
            {recents.map((app) => (
              <Badge key={app.id}>{app.name}</Badge>
            ))}
          </div>
        </Card>
      )}

      {Object.keys(grouped).length === 0 && (
        <Card className="text-center text-sm text-slate-600">No apps match your search or filters.</Card>
      )}

      {Object.entries(grouped).map(([category, categoryApps]) => (
        <section key={category} className="space-y-3">
          <h2 className="text-xl font-semibold">{category}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryApps.map((app) => (
              <Card key={app.id} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{app.name}</h3>
                    <p className="text-sm text-slate-600">{app.description}</p>
                  </div>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => startTransition(() => toggleFavoriteAction(app.id))}
                  >
                    <Star className={`h-5 w-5 ${app.favorite ? 'fill-yellow-400 text-yellow-500' : 'text-slate-400'}`} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {app.tags.map((tag) => (
                    <Badge key={tag}>#{tag}</Badge>
                  ))}
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    startTransition(() => trackOpenAction(app.id));
                    window.open(app.url, '_blank', 'noopener,noreferrer');
                  }}
                >
                  Open <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
