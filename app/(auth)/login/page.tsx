import { Card } from '@/components/ui/card';
import { LoginForm } from '@/components/dashboard/login-form';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_40%)]" />
      <Card className="z-10 w-full max-w-md space-y-4 border-slate-800 bg-slate-900/90 text-slate-100 backdrop-blur">
        <div>
          <p className="mb-2 inline-flex rounded-full bg-blue-500/20 px-2 py-1 text-xs font-semibold text-blue-200">App Portal</p>
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <p className="text-sm text-slate-300">Sign in or create an account to access your portal.</p>
        </div>
        <LoginForm />
      </Card>
    </main>
  );
}
