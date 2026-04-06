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
  created_at: string;
};

export type ClassMembersRow = {
  id: string;
  class_id: string;
  user_id: string;
};
