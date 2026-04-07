// Student dashboard: show current user + enrolled classes, plus join-by-code flow.

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import type { ClassesRow } from "@/app/types/supabase";
import { getMyStudentClasses } from "@/app/lib/queries/classes";
import { useAuthUser } from "@/app/hooks/useAuthUser";
import { useMyProfile } from "@/app/hooks/useMyProfile";
import ClassCard from "@/app/components/class/ClassCard";
import JoinClassForm from "@/app/components/class/JoinClassForm";
import Spinner from "@/app/components/ui/Spinner";
import Card from "@/app/components/ui/Card";

export default function StudentDashboardPage() {
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
      const rows = await getMyStudentClasses(supabase, userId);
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
      if (profile.role !== "student") {
        router.replace("/dashboard/teacher");
        return;
      }
    }
  }, [authLoading, userId, profileLoading, profile?.role, router]);

  useEffect(() => {
    if (!userId) return;
    if (profileLoading) return;
    if (profile?.role !== "student") return;
    void loadClasses();
  }, [userId, profile?.role, profileLoading, loadClasses]);

  const handleJoined = async () => {
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

  const displayName = profile?.display_name ?? user?.email ?? "Student";

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[18px] font-semibold">Welcome, {displayName}</div>

      <Card className="p-[16px]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[#1F2937] font-semibold">Your classes</div>
            <div className="text-[#6B7280] text-[13px] mt-1">
              Join with a code or keep learning.
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
              You haven’t joined any classes yet.
            </div>
          ) : null}

          {!loadingClasses
            ? classes.map((c) => <ClassCard key={c.id} classRow={c} />)
            : null}
        </div>

        <div className="mt-5">
          <JoinClassForm userId={userId!} onJoined={handleJoined} />
        </div>
      </Card>
    </div>
  );
}
