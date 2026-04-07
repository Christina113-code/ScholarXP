// Supabase query helpers for `classes` and `class_members`.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ClassesRow } from "@/app/types/supabase";

type ClassIdRow = { class_id: string };
type MembershipIdRow = { id: string };

export async function getMyTeacherClasses(
  supabase: SupabaseClient,
  teacherId: string,
): Promise<ClassesRow[]> {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("teacher_id", teacherId);

  if (error) throw error;
  return (data as ClassesRow[] | null) ?? [];
}

export async function getMyStudentClasses(
  supabase: SupabaseClient,
  studentId: string,
): Promise<ClassesRow[]> {
  const { data: memberships, error } = await supabase
    .from("class_members")
    .select("class_id")
    .eq("student_id", studentId);

  if (error) throw error;
  const classIds = ((memberships ?? []) as ClassIdRow[]).map((m) => m.class_id);

  if (!classIds || classIds.length === 0) return [];

  const { data: classes, error: classesError } = await supabase
    .from("classes")
    .select("*")
    .in("id", classIds);

  if (classesError) throw classesError;
  return (classes as ClassesRow[] | null) ?? [];
}

export async function createClass(
  supabase: SupabaseClient,
  input: { name: string; code: string; createdBy: string },
): Promise<ClassesRow> {
  const { data, error } = await supabase
    .from("classes")
    .insert({
      id: crypto.randomUUID(),
      name: input.name,
      join_code: input.code,
      teacher_id: input.createdBy,
      created_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) console.log(error);
  return data as ClassesRow;
}

export async function joinClassByCode(
  supabase: SupabaseClient,
  input: { userId: string; code: string },
): Promise<ClassesRow | null> {
  const { data: classRow, error: classError } = await supabase
    .from("classes")
    .select("*")
    .eq("join_code", input.code)
    .maybeSingle();

  if (classError) console.log(classError);
  if (!classRow) return null;
  const typedClassRow = classRow as ClassesRow;

  const { data: existing, error: membershipError } = await supabase
    .from("class_members")
    .select("id")
    .eq("class_id", typedClassRow.id)
    .eq("student_id", input.userId)
    .maybeSingle();

  if (membershipError) console.log(membershipError);

  if (!(existing as MembershipIdRow | null)?.id) {
    const { error } = await supabase.from("class_members").insert({
      class_id: typedClassRow.id,
      student_id: input.userId,
    });

    if (error) console.log(error);
  }

  return typedClassRow;
}

export async function deleteClass(
  supabase: SupabaseClient,
  input: { classId: string; teacherId: string },
): Promise<void> {
  // Best-effort delete membership rows first (if no cascades exist).
  const { error: membersError } = await supabase
    .from("class_members")
    .delete()
    .eq("class_id", input.classId);

  if (membersError) throw membersError;

  const { error } = await supabase
    .from("classes")
    .delete()
    .eq("id", input.classId)
    .eq("teacher_id", input.teacherId);

  if (error) throw error;
}
