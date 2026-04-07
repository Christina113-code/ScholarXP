// ScholarXP Supabase row types (minimal subset).
// Keep these in sync with the columns you actually use in queries.

export type Role = "teacher" | "student";

export type ProfilesRow = {
  id: string;
  role: Role | null;
  display_name: string | null;
};

export type ClassesRow = {
  id: string;
  name: string;
  join_code: string | null;
  teacher_id: string;
  created_at: string;
};

export type AssignmentsRow = {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type AssignmentFilesRow = {
  id: string;
  assignment_id: string;
  file_path: string;
  file_type: string;
  uploaded_at: string;
};

export type AssignmentProblemsRow = {
  id: string;
  assignment_id: string;
  order_index: number;
  type: string;
  prompt: string;
  choices: unknown | null;
  answer: unknown | null;
  metadata: unknown | null;
  created_at: string;
};

export type ClassMembersRow = {
  id: string;
  class_id: string;
  user_id: string;
};
