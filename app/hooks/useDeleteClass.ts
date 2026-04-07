// Client hook to delete a class (teacher only).

"use client";

import { useCallback, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { deleteClass } from "@/app/lib/queries/classes";

export function useDeleteClass() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (input: { classId: string; teacherId: string }) => {
    setLoading(true);
    setError(null);
    try {
      await deleteClass(supabase, input);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete class.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteClass: run, loading, error } as const;
}

