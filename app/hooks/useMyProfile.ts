// Client hook to load the current user's row from `profiles`.

"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProfilesRow } from "@/app/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchMyProfile } from "@/app/lib/queries/profiles";
import { supabase } from "@/app/lib/supabase";

export function useMyProfile(userId: string | null) {
  const [profile, setProfile] = useState<ProfilesRow | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const row = await fetchMyProfile(supabase as SupabaseClient, userId);
      setProfile(row);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { profile, loading, refresh } as const;
}

