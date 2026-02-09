import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdminPanel } from '@/components/admin/admin-panel';

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) return null;
  if (session.user.role !== 'ADMIN') redirect('/');

  const [apps, categories, users, setting] = await Promise.all([
    prisma.app.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.user.findMany({ orderBy: { email: 'asc' }, select: { id: true, email: true, role: true } }),
    prisma.setting.findUnique({ where: { key: 'portal' } }),
  ]);

  const parsed = setting ? (JSON.parse(setting.value) as { portalName?: string; logoUrl?: string }) : {};

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Portal</h1>
      <AdminPanel data={{ apps, categories, users, settings: { portalName: parsed.portalName ?? 'App Portal', logoUrl: parsed.logoUrl ?? '' } }} />
    </div>
  );
}
