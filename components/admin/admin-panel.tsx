'use client';

import { useState, useTransition } from 'react';
import {
  deleteAppAction,
  deleteCategoryAction,
  saveAppAction,
  saveCategoryAction,
  saveSettingsAction,
  setUserRoleAction,
} from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';

type Data = {
  apps: Array<{ id: string; name: string; url: string; description: string; tags: string[]; isActive: boolean; categoryId: string | null }>;
  categories: Array<{ id: string; name: string; sortOrder: number }>;
  users: Array<{ id: string; email: string; role: 'USER' | 'ADMIN' }>;
  settings: { portalName: string; logoUrl: string };
};

export function AdminPanel({ data }: { data: Data }) {
  const [pending, startTransition] = useTransition();
  const [appForm, setAppForm] = useState({ name: '', url: '', description: '', tags: '', categoryId: '', iconUrl: '', isActive: true });

  return (
    <Tabs
      tabs={[
        {
          key: 'apps',
          label: 'Apps',
          content: (
            <div className="space-y-4">
              <Card>
                <h3 className="mb-3 font-semibold">Create app</h3>
                <div className="grid gap-2 md:grid-cols-2">
                  <Input placeholder="Name" value={appForm.name} onChange={(e) => setAppForm((s) => ({ ...s, name: e.target.value }))} />
                  <Input placeholder="URL" value={appForm.url} onChange={(e) => setAppForm((s) => ({ ...s, url: e.target.value }))} />
                  <Input
                    placeholder="Description"
                    value={appForm.description}
                    onChange={(e) => setAppForm((s) => ({ ...s, description: e.target.value }))}
                  />
                  <Input placeholder="Tags (comma separated)" value={appForm.tags} onChange={(e) => setAppForm((s) => ({ ...s, tags: e.target.value }))} />
                  <Input placeholder="Icon URL" value={appForm.iconUrl} onChange={(e) => setAppForm((s) => ({ ...s, iconUrl: e.target.value }))} />
                  <select
                    className="h-10 rounded-md border border-slate-300 px-3"
                    value={appForm.categoryId}
                    onChange={(e) => setAppForm((s) => ({ ...s, categoryId: e.target.value }))}
                  >
                    <option value="">Uncategorized</option>
                    {data.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  className="mt-3"
                  disabled={pending}
                  onClick={() => startTransition(() => saveAppAction(appForm))}
                >
                  Save app
                </Button>
              </Card>
              <div className="grid gap-3">
                {data.apps.map((app) => (
                  <Card key={app.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-slate-600">{app.url}</p>
                    </div>
                    <Button variant="destructive" onClick={() => startTransition(() => deleteAppAction(app.id))}>
                      Delete
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ),
        },
        {
          key: 'categories',
          label: 'Categories',
          content: (
            <div className="space-y-3">
              <CategoryForm pending={pending} onSave={(input) => startTransition(() => saveCategoryAction(input))} />
              {data.categories.map((category) => (
                <Card key={category.id} className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <Button variant="destructive" onClick={() => startTransition(() => deleteCategoryAction(category.id))}>
                    Delete
                  </Button>
                </Card>
              ))}
            </div>
          ),
        },
        {
          key: 'users',
          label: 'Users',
          content: (
            <div className="space-y-3">
              {data.users.map((user) => (
                <Card key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-slate-600">{user.role}</p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => startTransition(() => setUserRoleAction(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN'))}
                  >
                    {user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                  </Button>
                </Card>
              ))}
            </div>
          ),
        },
        {
          key: 'settings',
          label: 'Settings',
          content: <SettingsForm settings={data.settings} pending={pending} onSave={(input) => startTransition(() => saveSettingsAction(input))} />,
        },
      ]}
    />
  );
}

function CategoryForm({ onSave, pending }: { onSave: (data: { name: string; sortOrder: number }) => void; pending: boolean }) {
  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  return (
    <Card className="space-y-3">
      <h3 className="font-semibold">Create category</h3>
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
      <Button disabled={pending} onClick={() => onSave({ name, sortOrder })}>
        Save category
      </Button>
    </Card>
  );
}

function SettingsForm({
  settings,
  onSave,
  pending,
}: {
  settings: { portalName: string; logoUrl: string };
  onSave: (data: { portalName: string; logoUrl: string }) => void;
  pending: boolean;
}) {
  const [portalName, setPortalName] = useState(settings.portalName);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);

  return (
    <Card className="space-y-3">
      <h3 className="font-semibold">Portal Settings</h3>
      <Input value={portalName} onChange={(e) => setPortalName(e.target.value)} placeholder="Portal name" />
      <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Logo URL" />
      <Button disabled={pending} onClick={() => onSave({ portalName, logoUrl })}>
        Save settings
      </Button>
    </Card>
  );
}
