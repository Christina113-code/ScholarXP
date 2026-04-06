"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { fetchMyProfile } from "@/app/lib/queries/profiles";
import Spinner from "@/app/components/ui/Spinner";

// Dashboard redirect hub:
// - not logged in -> /login
// - logged in but no role -> /select-role
// - logged in with role -> /dashboard/student or /dashboard/teacher
export default function DashboardRedirectHub() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const profile = await fetchMyProfile(supabase, user.id);
        if (!profile?.role) {
          router.replace("/select-role");
          return;
        }

        router.replace(
          profile.role === "teacher"
            ? "/dashboard/teacher"
            : "/dashboard/student"
        );
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [router]);

  if (!loading) return null;
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <Spinner label="Loading your dashboard..." />
    </div>
  );
}
