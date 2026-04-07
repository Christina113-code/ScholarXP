// Runs the local assignment pipeline (parse -> problems).

"use client";

import { useCallback, useState } from "react";
import { parseAssignmentFiles, type ParsedProblem } from "@/app/lib/pipeline/assignments";

export function useAssignmentPipeline() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (files: File[]): Promise<ParsedProblem[]> => {
    setLoading(true);
    setError(null);
    try {
      return await parseAssignmentFiles(files);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Processing failed.";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { run, loading, error } as const;
}

