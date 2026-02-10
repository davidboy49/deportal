import { prisma } from '@/lib/prisma';
import { PortalClient } from '@/components/dashboard/portal-client';

type DashboardApp = {
  id: string;
  name: string;
  url: string;
  description: string;
  iconUrl: string | null;
  tags: string;
  categoryId: string | null;
  category: { name: string } | null;
};

type DashboardCategory = { name: string };

export default async function DashboardPage() {
  const [rawApps, categories] = await Promise.all([
    prisma.app.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { name: 'asc' },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  const apps = rawApps as DashboardApp[];
  const typedCategories = categories as DashboardCategory[];

  const normalized = apps.map((app) => ({
    ...app,
    tags: app.tags ? app.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    categoryName: app.category?.name ?? 'Uncategorized',
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">App Portal</h1>
      <PortalClient apps={normalized} categories={typedCategories.map((c) => c.name)} />
    </div>
  );
}
