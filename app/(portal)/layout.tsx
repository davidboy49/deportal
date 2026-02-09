import Link from 'next/link';
import { auth } from '@/lib/auth';
import { logoutAction } from '@/app/actions';
import { Button } from '@/components/ui/button';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold">
            App Portal
          </Link>
          <div className="flex items-center gap-2">
            {session?.user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-sm font-medium text-blue-700">
                Admin Portal
              </Link>
            )}
            <form action={logoutAction}>
              <Button variant="outline" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
