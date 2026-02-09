'use server';

import { revalidatePath } from 'next/cache';
import { AuthError } from 'next-auth';
import { auth, requireAdmin, signIn, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { appSchema, categorySchema, settingSchema } from '@/lib/validations';

export async function loginAction(_prevState: { error?: string }, formData: FormData) {
  try {
    await signIn('credentials', {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: 'Invalid credentials' };
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/login' });
}

export async function toggleFavoriteAction(appId: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const existing = await prisma.favorite.findUnique({
    where: { userId_appId: { userId: session.user.id, appId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { userId_appId: { userId: session.user.id, appId } } });
  } else {
    await prisma.favorite.create({ data: { userId: session.user.id, appId } });
  }
  revalidatePath('/');
}

export async function trackOpenAction(appId: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  await prisma.recentOpen.upsert({
    where: { userId_appId: { userId: session.user.id, appId } },
    create: { userId: session.user.id, appId },
    update: { lastOpenedAt: new Date() },
  });

  revalidatePath('/');
}

export async function saveAppAction(input: unknown, id?: string) {
  await requireAdmin();
  const parsed = appSchema.parse(input);
  const data = {
    ...parsed,
    iconUrl: parsed.iconUrl || null,
    categoryId: parsed.categoryId || null,
    tags: parsed.tags ? parsed.tags.split(',').map((x) => x.trim()).filter(Boolean) : [],
  };

  if (id) await prisma.app.update({ where: { id }, data });
  else await prisma.app.create({ data });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deleteAppAction(id: string) {
  await requireAdmin();
  await prisma.app.delete({ where: { id } });
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function saveCategoryAction(input: unknown, id?: string) {
  await requireAdmin();
  const parsed = categorySchema.parse(input);
  if (id) await prisma.category.update({ where: { id }, data: parsed });
  else await prisma.category.create({ data: parsed });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath('/admin');
}

export async function setUserRoleAction(userId: string, role: 'USER' | 'ADMIN') {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath('/admin');
}

export async function saveSettingsAction(input: unknown) {
  await requireAdmin();
  const parsed = settingSchema.parse(input);
  const value = JSON.stringify({ portalName: parsed.portalName, logoUrl: parsed.logoUrl || '' });
  await prisma.setting.upsert({
    where: { key: 'portal' },
    create: { key: 'portal', value },
    update: { value },
  });
  revalidatePath('/admin');
  revalidatePath('/');
}
