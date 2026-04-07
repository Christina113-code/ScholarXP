"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/app/components/ui/Spinner";
import AuthCard from "@/app/components/auth/AuthCard";
import Button from "@/app/components/ui/Button";
import { useAuthUser } from "@/app/hooks/useAuthUser";
import { useMyProfile } from "@/app/hooks/useMyProfile";
import { upsertMyProfileRole } from "@/app/lib/queries/profiles";
import { supabase } from "@/app/lib/supabase";

export default function SelectRole() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthUser();
  const { profile, loading: profileLoading } = useMyProfile(user?.id ?? null);

  // Redirect logic moved entirely into useEffect
  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }
    // If profile is still null, do nothing — wait for real data
    if (profile === null) return;
    if (profile?.role) {
      router.replace(
        profile.role === "teacher"
          ? "/dashboard/teacher"
          : "/dashboard/student",
      );
    }
  }, [authLoading, profileLoading, user, profile, router]);

  const chooseRole = async (role: "teacher" | "student") => {
    if (!user) return;

    const rawName = (user.user_metadata as Record<string, unknown>)?.full_name;
    const displayName = typeof rawName === "string" ? rawName : null;

    await upsertMyProfileRole(supabase, {
      userId: user.id,
      role,
      displayName,
    });

    router.replace(
      role === "teacher" ? "/dashboard/teacher" : "/dashboard/student",
    );
  };

  // Loading state
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Spinner label="Loading..." />
      </div>
    );
  }

  // If user exists but has no role, show role selection UI
  return (
    <AuthCard
      title="Select your role"
      subtitle="Choose teacher or student to personalize your dashboard."
    >
      <div className="flex flex-col gap-3">
        <Button onClick={() => chooseRole("teacher")}>I’m a Teacher</Button>
        <Button variant="secondary" onClick={() => chooseRole("student")}>
          I’m a Student
        </Button>
      </div>
    </AuthCard>
  );
}
