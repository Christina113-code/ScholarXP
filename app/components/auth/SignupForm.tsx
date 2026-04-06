// Student/teacher signup UI (email + password) using Supabase Auth.

"use client";

import { useState } from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSignup = async () => {
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${origin}/auth/callback` },
      });

      if (error) throw error;

      // The user may need to confirm their email (depends on your Supabase config).
      setInfo("Check your email for the signup link. Then choose your role.");
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to start signup.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-3">
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
          autoComplete="new-password"
        />
      </div>

      <Button
        onClick={handleSignup}
        disabled={submitting || !email.trim() || password.length < 6}
      >
        {submitting ? "Creating..." : "Create account"}
      </Button>

      {error ? (
        <div className="rounded-[14px] border border-[#EF4444] bg-[#EF4444]/10 p-3 text-[#EF4444] text-[13px]">
          {error}
        </div>
      ) : null}

      {info ? (
        <div className="rounded-[14px] border border-[#E6E8EC] bg-white p-3 text-[#6B7280] text-[13px]">
          {info}
        </div>
      ) : null}

      <div className="text-[14px] text-[#6B7280] text-center">
        Already have an account?{" "}
        <Link className="text-[#5C6AC4] font-semibold" href="/login">
          Log in
        </Link>
      </div>
    </div>
  );
}

