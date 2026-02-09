import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
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
  favorites: Array<{ userId: string; appId: string }>;
};

type RecentItem = { app: DashboardApp };
type DashboardCategory = { name: string };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [rawApps, categories, rawRecents] = await Promise.all([
    prisma.app.findMany({
      where: { isActive: true },
      include: { category: true, favorites: { where: { userId: session.user.id } } },
      orderBy: { name: 'asc' },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.recentOpen.findMany({
      where: { userId: session.user.id },
      include: { app: { include: { category: true, favorites: { where: { userId: session.user.id } } } } },
      orderBy: { lastOpenedAt: 'desc' },
      take: 5,
    }),
  ]);

  const apps = rawApps as DashboardApp[];
  const recents = rawRecents as RecentItem[];
  const typedCategories = categories as DashboardCategory[];

  const normalized = apps.map((app) => ({
    ...app,
    tags: app.tags ? app.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    categoryName: app.category?.name ?? 'Uncategorized',
    favorite: app.favorites.length > 0,
  }));

  const recentApps = recents.map(({ app }) => ({
    ...app,
    tags: app.tags ? app.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    categoryName: app.category?.name ?? 'Uncategorized',
    favorite: app.favorites.length > 0,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Your Apps</h1>
      <PortalClient apps={normalized} categories={typedCategories.map((c) => c.name)} recents={recentApps} />
    </div>
  );
}
