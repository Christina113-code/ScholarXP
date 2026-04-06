// Top-level login page required by the redirect rules.

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/app/hooks/useAuthUser";
import AuthCard from "@/app/components/auth/AuthCard";
import LoginForm from "@/app/components/auth/LoginForm";
import Spinner from "@/app/components/ui/Spinner";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuthUser();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Spinner label="Loading..." />
      </div>
    );
  }

  if (user) return null;

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to join or create your math classes."
    >
      <LoginForm />
    </AuthCard>
  );
}

