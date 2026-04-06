// Supabase query helpers for `classes` and `class_members`.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ClassesRow } from "@/app/types/supabase";

type ClassIdRow = { class_id: string };
type MembershipIdRow = { id: string };

export async function getMyTeacherClasses(
  supabase: SupabaseClient,
  teacherId: string
): Promise<ClassesRow[]> {
  const { data, error } = await supabase
    .from<ClassesRow>("classes")
    .select("*")
    .eq("created_by", teacherId);

  if (error) throw error;
  return data ?? [];
}

export async function getMyStudentClasses(
  supabase: SupabaseClient,
  studentId: string
): Promise<ClassesRow[]> {
  const { data: memberships, error } = await supabase
    .from<ClassIdRow>("class_members")
    .select("class_id")
    .eq("user_id", studentId);

  if (error) throw error;
  const classIds = memberships?.map((m) => m.class_id);

  if (!classIds || classIds.length === 0) return [];

  const { data: classes, error: classesError } = await supabase
    .from<ClassesRow>("classes")
    .select("*")
    .in("id", classIds);

  if (classesError) throw classesError;
  return classes ?? [];
}

export async function createClass(
  supabase: SupabaseClient,
  input: { name: string; code: string; createdBy: string }
): Promise<ClassesRow> {
  const { data, error } = await supabase
    .from<ClassesRow>("classes")
    .insert({
      name: input.name,
      code: input.code,
      created_by: input.createdBy,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function joinClassByCode(
  supabase: SupabaseClient,
  input: { userId: string; code: string }
): Promise<ClassesRow | null> {
  const { data: classRow, error: classError } = await supabase
    .from<ClassesRow>("classes")
    .select("*")
    .eq("code", input.code)
    .maybeSingle();

  if (classError) throw classError;
  if (!classRow) return null;

  const { data: existing, error: membershipError } = await supabase
    .from<MembershipIdRow>("class_members")
    .select("id")
    .eq("class_id", classRow.id)
    .eq("user_id", input.userId)
    .maybeSingle();

  if (membershipError) throw membershipError;

  if (!existing) {
    const { error } = await supabase
      .from("class_members")
      .insert({
        class_id: classRow.id,
        user_id: input.userId,
      });

    if (error) throw error;
  }

  return classRow;
}

