import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { PortalClient } from '@/components/dashboard/portal-client';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [apps, categories, recents] = await Promise.all([
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

  const normalized = apps.map((app) => ({
    ...app,
    categoryName: app.category?.name ?? 'Uncategorized',
    favorite: app.favorites.length > 0,
  }));

  const recentApps = recents.map(({ app }) => ({
    ...app,
    categoryName: app.category?.name ?? 'Uncategorized',
    favorite: app.favorites.length > 0,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Your Apps</h1>
      <PortalClient apps={normalized} categories={categories.map((c) => c.name)} recents={recentApps} />
    </div>
  );
}
