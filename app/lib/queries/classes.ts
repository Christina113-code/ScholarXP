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

  console.log("getMyTeacherClasses", data, error);
  if (error) console.log(error.message);
  return (data as ClassesRow[] | null) ?? [];
}

export async function getMyStudentClasses(
  supabase: SupabaseClient,
  studentId: string,
): Promise<ClassesRow[]> {
  const { data: memberships, error } = await supabase
    .from("class_members")
    .select("class_id")
    .eq("user_id", studentId);

  if (error) console.log(error.message);
  const classIds = ((memberships ?? []) as ClassIdRow[]).map((m) => m.class_id);

  if (!classIds || classIds.length === 0) return [];

  const { data: classes, error: classesError } = await supabase
    .from("classes")
    .select("*")
    .in("id", classIds);

  if (classesError) console.log(classesError.message);
  return (classes as ClassesRow[] | null) ?? [];
}

export async function createClass(
  supabase: SupabaseClient,
  input: { name: string; code: string; createdBy: string },
): Promise<ClassesRow> {
  console.log("Creating class", input);
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

  if (error) console.log(error.message);
  return data as ClassesRow;
}

export async function joinClassByCode(
  supabase: SupabaseClient,
  input: { userId: string; code: string },
): Promise<ClassesRow | null> {
  const { data: classRow, error: classError } = await supabase
    .from("classes")
    .select("*")
    .eq("code", input.code)
    .maybeSingle();

  if (classError) console.log(classError.message);
  if (!classRow) return null;
  const typedClassRow = classRow as ClassesRow;

  const { data: existing, error: membershipError } = await supabase
    .from("class_members")
    .select("id")
    .eq("class_id", typedClassRow.id)
    .eq("user_id", input.userId)
    .maybeSingle();

  if (membershipError) console.log(membershipError.message);

  if (!(existing as MembershipIdRow | null)?.id) {
    const { error } = await supabase.from("class_members").insert({
      class_id: typedClassRow.id,
      user_id: input.userId,
    });

    if (error) console.log(error.message);
  }

  return typedClassRow;
}
