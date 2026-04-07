// Upload PDFs to Supabase Storage and create `assignment_files` rows.

"use client";

import { useCallback, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { createDraftAssignment, insertAssignmentFile } from "@/app/lib/queries/assignments";
import type { AssignmentFilesRow, AssignmentsRow } from "@/app/types/supabase";

const ASSIGNMENTS_BUCKET = "assignments";

export function useAssignmentUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (input: {
      classId: string;
      teacherId: string;
      files: File[];
    }): Promise<{
      assignment: AssignmentsRow;
      uploadedFiles: { file: File; row: AssignmentFilesRow }[];
    }> => {
      setLoading(true);
      setError(null);
      try {
        const assignment = await createDraftAssignment(supabase, {
          classId: input.classId,
          teacherId: input.teacherId,
        });

        const uploadedFiles: { file: File; row: AssignmentFilesRow }[] = [];

        for (const file of input.files) {
          const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
          const safeName = file.name.replaceAll(/[^a-zA-Z0-9._-]/g, "_");
          const path = `${assignment.id}/${crypto.randomUUID()}-${safeName}`;

          const { error: uploadError } = await supabase.storage
            .from(ASSIGNMENTS_BUCKET)
            .upload(path, file, {
              upsert: false,
              contentType: file.type || "application/pdf",
            });

          if (uploadError) throw uploadError;

          const row = await insertAssignmentFile(supabase, {
            assignmentId: assignment.id,
            filePath: path,
            fileType: ext,
          });

          uploadedFiles.push({ file, row });
        }

        return { assignment, uploadedFiles };
      } catch (e) {
        const message = e instanceof Error ? e.message : "Upload failed.";
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { upload, loading, error } as const;
}

