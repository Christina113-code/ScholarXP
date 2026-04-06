"use client";

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

  const chooseRole = async (role: "teacher" | "student") => {
    if (!user) return;
    const displayName =
      (user.user_metadata as Record<string, unknown>)?.full_name ?? null;

    await upsertMyProfileRole(
      supabase,
      {
        userId: user.id,
        role,
        displayName,
      }
    );

    router.replace(role === "teacher" ? "/dashboard/teacher" : "/dashboard/student");
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Spinner label="Loading..." />
      </div>
    );
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  if (profile?.role) {
    router.replace(
      profile.role === "teacher"
        ? "/dashboard/teacher"
        : "/dashboard/student"
    );
    return null;
  }

  return (
    <AuthCard title="Select your role" subtitle="Choose teacher or student to personalize your dashboard.">
      <div className="flex flex-col gap-3">
        <Button onClick={() => chooseRole("teacher")}>I’m a Teacher</Button>
        <Button variant="secondary" onClick={() => chooseRole("student")}>
          I’m a Student
        </Button>
      </div>
    </AuthCard>
  );
}
