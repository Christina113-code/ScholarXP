// Teacher dashboard: show current user + classes they created, plus create-class flow.

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import type { ClassesRow } from "@/app/types/supabase";
import { getMyTeacherClasses } from "@/app/lib/queries/classes";
import { useAuthUser } from "@/app/hooks/useAuthUser";
import { useMyProfile } from "@/app/hooks/useMyProfile";
import ClassCard from "@/app/components/class/ClassCard";
import CreateClassForm from "@/app/components/class/CreateClassForm";
import Spinner from "@/app/components/ui/Spinner";
import Card from "@/app/components/ui/Card";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthUser();
  const userId = user?.id ?? null;
  const { profile, loading: profileLoading, refresh } = useMyProfile(userId);

  const [classes, setClasses] = useState<ClassesRow[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClasses = useCallback(async () => {
    if (!userId) return;
    setLoadingClasses(true);
    setError(null);
    try {
      const rows = await getMyTeacherClasses(supabase, userId);
      setClasses(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load classes.");
    } finally {
      setLoadingClasses(false);
    }
  }, [userId]);

  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      router.replace("/login");
      return;
    }
    // Wait for real profile
    if (profile === null) return;
    if (!profileLoading) {
      if (!profile?.role) {
        router.replace("/select-role");
        return;
      }
      if (profile.role !== "teacher") {
        router.replace("/dashboard/student");
        return;
      }
    }
  }, [authLoading, userId, profileLoading, profile?.role, router]);

  useEffect(() => {
    if (!userId) return;
    if (profileLoading) return;
    if (profile?.role !== "teacher") return;
    void loadClasses();
  }, [userId, profile?.role, profileLoading, loadClasses]);

  const handleCreated = async () => {
    await refresh();
    await loadClasses();
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner label="Loading..." />
      </div>
    );
  }

  const displayName = profile?.display_name ?? user?.email ?? "Teacher";

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[18px] font-semibold">Welcome, {displayName}</div>

      <Card className="p-[16px]">
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="text-[#1F2937] font-semibold">Your classes</div>
            <div className="text-[#6B7280] text-[13px]">
              Students join using the class code.
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {loadingClasses ? <Spinner label="Loading classes..." /> : null}

          {!loadingClasses && error ? (
            <div className="rounded-[14px] border border-[#EF4444] bg-[#EF4444]/10 p-3 text-[#EF4444] text-[13px]">
              {error}
            </div>
          ) : null}

          {!loadingClasses && !error && classes.length === 0 ? (
            <div className="text-[#6B7280] text-[14px]">
              No classes yet. Create one below.
            </div>
          ) : null}

          {!loadingClasses
            ? classes.map((c) => <ClassCard key={c.id} classRow={c} />)
            : null}
        </div>

        <div className="mt-6">
          <CreateClassForm teacherId={userId!} onCreated={handleCreated} />
        </div>
      </Card>
    </div>
  );
}
