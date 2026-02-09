import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdminPanel } from '@/components/admin/admin-panel';

type AdminApp = {
  id: string;
  name: string;
  url: string;
  description: string;
  tags: string;
  isActive: boolean;
  categoryId: string | null;
};

type AdminUser = { id: string; email: string; role: string };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) return null;
  if (session.user.role !== 'ADMIN') redirect('/');

  const [rawApps, categories, rawUsers, setting] = await Promise.all([
    prisma.app.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.user.findMany({ orderBy: { email: 'asc' }, select: { id: true, email: true, role: true } }),
    prisma.setting.findUnique({ where: { key: 'portal' } }),
  ]);

  const apps = rawApps as AdminApp[];
  const users = rawUsers as AdminUser[];

  const parsed = setting ? (JSON.parse(setting.value) as { portalName?: string; logoUrl?: string }) : {};

  const normalizedApps = apps.map((app: AdminApp) => ({
    ...app,
    tags: app.tags ? app.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
  }));
  const normalizedUsers: Array<{ id: string; email: string; role: 'USER' | 'ADMIN' }> = users.map((user: AdminUser) => ({
    ...user,
    role: (user.role === 'ADMIN' ? 'ADMIN' : 'USER') as 'USER' | 'ADMIN',
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Portal</h1>
      <AdminPanel
        data={{
          apps: normalizedApps,
          categories,
          users: normalizedUsers,
          settings: { portalName: parsed.portalName ?? 'App Portal', logoUrl: parsed.logoUrl ?? '' },
        }}
      />
    </div>
  );
}
