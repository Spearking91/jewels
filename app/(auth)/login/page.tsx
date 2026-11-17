"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Lock, Envelope, LoaderDots } from "@boxicons/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      // Use window.location.href for a clean full-page load that clears stale cache
      window.location.href = "/sudosu";
    }
  };

  return (
    <div className="min-h-screen bg-base-200/50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-200/60 rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-xs text-base-content/60 mt-1">
            Sign in to access your jewelry inventory dashboard
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="alert alert-error text-xs mb-6 py-3">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold">
                Email Address
              </span>
            </label>
            <div className=" input input-bordered input-sm w-full flex flex-row gap-2 items-center">
              <Envelope className="size-5 text-base-content/60" />
              <input
                type="email"
                required
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className=" w-full text-xs"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold">Password</span>
            </label>
            <div className=" input input-bordered input-sm w-full flex flex-row gap-2 items-center">
              <Lock className="size-5 text-base-content/60" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" w-full text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-sm w-full font-medium normal-case"
            >
              {loading ? (
                <>
                  <LoaderDots className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
