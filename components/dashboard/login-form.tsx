'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { loginAction, signupAction } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const initialState: { error?: string; success?: string } = {};

type Mode = 'login' | 'signup';

function SubmitButton({ mode }: { mode: Mode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : mode === 'login' ? 'Sign in' : 'Create account'}
    </Button>
  );
}

export function LoginForm() {
  const [mode, setMode] = useState<Mode>('login');
  const [loginState, loginFormAction] = useFormState(loginAction as never, initialState);
  const [signupState, signupFormAction] = useFormState(signupAction as never, initialState);

  const state = mode === 'login' ? loginState : signupState;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          Sign up
        </button>
      </div>

      {mode === 'login' ? (
        <form action={loginFormAction} className="space-y-3">
          <Input type="email" name="email" placeholder="Email" required />
          <Input type="password" name="password" placeholder="Password" required />
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <SubmitButton mode="login" />
        </form>
      ) : (
        <form action={signupFormAction} className="space-y-3">
          <Input type="email" name="email" placeholder="Email" required />
          <Input type="password" name="password" placeholder="Password" required />
          <Input type="password" name="confirmPassword" placeholder="Confirm password" required />
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          {state?.success && <p className="text-sm text-emerald-600">{state.success}</p>}
          <p className="text-xs text-slate-500">Use at least 8 chars with upper, lower, and number.</p>
          <SubmitButton mode="signup" />
        </form>
      )}
    </div>
  );
}
