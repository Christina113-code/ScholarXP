"use client";

import { useState } from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher" | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setError(null);
    setSubmitting(true);

    try {
      // 1. Create auth user
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) console.log(signupError);

      const user = data.user;
      if (!user) throw new Error("User not returned from signup.");

      // 2. Create profile row
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        email,
        role,
      });

      if (profileError) throw profileError;

      // 3. Redirect to callback (session verification)
      window.location.href = "/auth/callback";
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to create account.";
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
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        {/* Role selection */}
        <div className="flex gap-3">
          <Button
            variant={role === "student" ? "primary" : "secondary"}
            onClick={() => setRole("student")}
          >
            Student
          </Button>

          <Button
            variant={role === "teacher" ? "primary" : "secondary"}
            onClick={() => setRole("teacher")}
          >
            Teacher
          </Button>
        </div>
      </div>

      <Button
        onClick={handleSignup}
        disabled={
          submitting || !email.trim() || password.length < 6 || role === ""
        }
      >
        {submitting ? "Creating..." : "Create account"}
      </Button>

      {error ? (
        <div className="rounded-[14px] border border-[#EF4444] bg-[#EF4444]/10 p-3 text-[#EF4444] text-[13px]">
          {error}
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
