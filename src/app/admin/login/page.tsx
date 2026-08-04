"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth";
import { FlameMark } from "@/components/FlameMark";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <FlameMark className="w-6 h-6" />
          <span className="font-display text-2xl">
            Light<span className="text-gold">News</span>
          </span>
        </div>
        <form action={formAction} className="space-y-4 bg-surface border border-hairline rounded-lg p-6">
          <div>
            <label htmlFor="email" className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-bg border border-hairline rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-bg border border-hairline rounded px-3 py-2 text-sm"
            />
          </div>
          {state.error && <p className="text-crimson text-sm">{state.error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gold text-bg font-medium rounded py-2 text-sm disabled:opacity-60"
          >
            {isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
