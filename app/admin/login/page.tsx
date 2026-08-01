"use client";

import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Suspense } from "react";

const ERROR_MAP: Record<string, string> = {
  invalid: "Invalid username or password.",
  missing: "Username and password are required.",
  server: "Server error. Please try again.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const errorKey = searchParams.get("error");
  const errorMessage = errorKey ? ERROR_MAP[errorKey] : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080808] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 glass-card rounded-3xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.4)] mb-4">
            <Lock size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-sm text-white/40">Enter your credentials to continue</p>
        </div>

        {/* Plain HTML form — posts directly to /api/auth/login-form route handler
            The route handler sets the cookie and issues a real HTTP 303 redirect in one response */}
        <form method="POST" action="/api/auth/login-form" className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 font-medium mb-1.5">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 transition-all duration-300"
              placeholder="manish"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 font-medium mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-400 text-center bg-red-400/10 border border-red-400/20 rounded-xl py-2 px-4">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300 mt-2"
          >
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
