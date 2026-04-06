// Student/teacher login UI using Supabase passwordless email link + Google OAuth.

"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${origin}/auth/callback` },
      });

      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to start login.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to start Google login.";
      setError(message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <Button
          onClick={handleSendOtp}
          disabled={submitting || !email.trim()}
        >
          {submitting ? "Sending..." : "Send login link"}
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-[1px] flex-1 bg-[#E6E8EC]" />
          <div className="text-[13px] text-[#6B7280]">OR</div>
          <div className="h-[1px] flex-1 bg-[#E6E8EC]" />
        </div>

        <Button variant="secondary" onClick={handleGoogle} disabled={submitting}>
          Continue with Google
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
    </>
  );
}

