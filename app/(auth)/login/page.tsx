import { Card } from '@/components/ui/card';
import { LoginForm } from '@/components/dashboard/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-slate-600">Sign in to access your app portal.</p>
        </div>
        <LoginForm />
      </Card>
    </main>
  );
}
