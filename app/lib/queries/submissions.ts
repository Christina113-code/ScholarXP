import type { SupabaseClient } from "@supabase/supabase-js";

// Student side: check if THIS student completed THIS assignment
export async function checkAssignmentCompleted(
  supabase: SupabaseClient,
  studentId: string,
  assignmentId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("submissions")
    .select("id")
    .eq("assignment_id", assignmentId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;

  return !!data; // true = completed, false = not completed
}
// Teacher side: list all students + whether they completed the assignment
// //returns: {
//   student_id: string;
//   completed: boolean;
//   submitted_at?: string;
// }
export async function getAssignmentCompletionForClass(
  supabase: SupabaseClient,
  classId: string,
  assignmentId: string,
) {
  // 1. Get all students in the class
  const { data: students, error: studentsErr } = await supabase
    .from("class_members")
    .select("student_id")
    .eq("class_id", classId);

  if (studentsErr) throw studentsErr;

  // 2. Get all submissions for this assignment
  const { data: submissions, error: submissionsErr } = await supabase
    .from("submissions")
    .select("student_id, submitted_at")
    .eq("assignment_id", assignmentId);

  if (submissionsErr) throw submissionsErr;

  // 3. Build a fast lookup map
  const submissionMap = new Map(
    submissions.map((s) => [s.student_id, s.submitted_at]),
  );

  // 4. Return combined result
  return students.map((s) => ({
    student_id: s.student_id,
    completed: submissionMap.has(s.student_id),
    submitted_at: submissionMap.get(s.student_id) ?? null,
  }));
}
