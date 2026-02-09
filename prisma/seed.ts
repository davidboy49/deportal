import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@local.test';
  const passwordHash = await bcrypt.hash('Admin123!', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "ADMIN" },
    create: { email: adminEmail, passwordHash, role: "ADMIN" },
  });

  const [productivity, communication, devtools] = await Promise.all([
    prisma.category.upsert({ where: { name: 'Productivity' }, update: { sortOrder: 1 }, create: { name: 'Productivity', sortOrder: 1 } }),
    prisma.category.upsert({ where: { name: 'Communication' }, update: { sortOrder: 2 }, create: { name: 'Communication', sortOrder: 2 } }),
    prisma.category.upsert({ where: { name: 'Developer Tools' }, update: { sortOrder: 3 }, create: { name: 'Developer Tools', sortOrder: 3 } }),
  ]);

  await Promise.all([
    prisma.app.upsert({
      where: { id: 'sample-notion' },
      update: {},
      create: {
        id: 'sample-notion',
        name: 'Notion',
        url: 'https://www.notion.so',
        description: 'Workspace for notes and projects',
        tags: 'notes,docs',
        categoryId: productivity.id,
      },
    }),
    prisma.app.upsert({
      where: { id: 'sample-slack' },
      update: {},
      create: {
        id: 'sample-slack',
        name: 'Slack',
        url: 'https://slack.com',
        description: 'Team communication hub',
        tags: 'chat,team',
        categoryId: communication.id,
      },
    }),
    prisma.app.upsert({
      where: { id: 'sample-github' },
      update: {},
      create: {
        id: 'sample-github',
        name: 'GitHub',
        url: 'https://github.com',
        description: 'Code hosting and collaboration',
        tags: 'code,git',
        categoryId: devtools.id,
      },
    }),
  ]);

  await prisma.setting.upsert({
    where: { key: 'portal' },
    update: { value: JSON.stringify({ portalName: 'App Portal', logoUrl: '' }) },
    create: { key: 'portal', value: JSON.stringify({ portalName: 'App Portal', logoUrl: '' }) },
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
