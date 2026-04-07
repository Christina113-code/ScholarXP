"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect after successful login
      window.location.href = "/auth/callback";
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to sign in.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      <Button
        onClick={handleLogin}
        disabled={submitting || !email.trim() || !password.trim()}
      >
        {submitting ? "Signing in..." : "Sign in"}
      </Button>

      {error ? (
        <div className="rounded-[14px] border border-[#EF4444] bg-[#EF4444]/10 p-3 text-[#EF4444] text-[13px]">
          {error}
        </div>
      ) : null}

      <div className="text-[14px] text-[#6B7280] text-center">
        New here?{" "}
        <Link className="text-[#5C6AC4] font-semibold" href="/signup">
          Create an account
        </Link>
      </div>
    </div>
  );
}
