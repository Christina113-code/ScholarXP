// Client hook to load the current Supabase authenticated user.

"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/app/lib/supabase";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      setUser(null);
      setLoading(false);
      return;
    }
    setUser(data.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const run = async () => {
      await refresh();
    };

    void run();
  }, [refresh]);

  return { user, loading, refresh } as const;
}

