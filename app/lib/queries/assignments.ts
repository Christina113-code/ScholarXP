// Supabase query helpers for `assignments`, `assignment_files`, `assignment_problems`.

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AssignmentFilesRow,
  AssignmentProblemsRow,
  AssignmentsRow,
} from "@/app/types/supabase";

export async function createDraftAssignment(
  supabase: SupabaseClient,
  input: {
    classId: string;
    teacherId: string;
  },
): Promise<AssignmentsRow> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const { data, error } = await supabase
    .from("assignments")
    .insert({
      id,
      class_id: input.classId,
      teacher_id: input.teacherId,
      title: "Untitled assignment",
      description: null,
      status: "draft",
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as AssignmentsRow;
}

export async function updateAssignment(
  supabase: SupabaseClient,
  input: {
    assignmentId: string;
    title: string;
    description: string | null;
    status: string;
  },
): Promise<void> {
  const { error } = await supabase
    .from("assignments")
    .update({
      title: input.title,
      description: input.description,
      status: input.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.assignmentId);

  if (error) throw error;
}

export async function insertAssignmentFile(
  supabase: SupabaseClient,
  input: {
    assignmentId: string;
    filePath: string;
    fileType: string;
  },
): Promise<AssignmentFilesRow> {
  const { data, error } = await supabase
    .from("assignment_files")
    .insert({
      id: crypto.randomUUID(),
      assignment_id: input.assignmentId,
      file_path: input.filePath,
      file_type: input.fileType,
      uploaded_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as AssignmentFilesRow;
}

export type NewAssignmentProblem = Omit<
  AssignmentProblemsRow,
  "id" | "assignment_id" | "created_at"
> & {
  type: string;
};

export async function insertAssignmentProblems(
  supabase: SupabaseClient,
  input: { assignmentId: string; problems: NewAssignmentProblem[] },
): Promise<void> {
  const now = new Date().toISOString();
  const rows = input.problems.map((p) => ({
    id: crypto.randomUUID(),
    assignment_id: input.assignmentId,
    order_index: p.order_index,
    type: p.type,
    prompt: p.prompt,
    choices: p.choices,
    answer: p.answer,
    metadata: p.metadata,
    created_at: now,
  }));

  const { error } = await supabase.from("assignment_problems").insert(rows);
  if (error) throw error;
}

export async function getAssignmentsForUserClass(
  supabase: SupabaseClient,
  classId: string,
): Promise<AssignmentsRow[]> {
  // // Check if user is teacher of the class
  // const { data: teacherMatch, error: teacherErr } = await supabase
  //   .from("classes")
  //   .select("id")
  //   .eq("id", classId)
  //   .single();

  // if (teacherErr && teacherErr.code !== "PGRST116") {
  //   // PGRST116 = no rows found
  //   throw teacherErr;
  // }

  // Fetch assignments
  const { data: assignments, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("class_id", classId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return assignments ?? [];
}
