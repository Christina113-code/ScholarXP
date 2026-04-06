import { supabase } from "@/app/lib/supabase";
import { ClassesRow } from "@/app/types/supabase";

/**
 * Fetch all classes created by a specific teacher.
 */
export async function getMyTeacherClasses(
  teacherId: string,
): Promise<ClassesRow[]> {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * Fetch all classes a student is enrolled in.
 */
export async function getClassesForStudent(
  studentId: string,
): Promise<ClassesRow[]> {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}
export async function createClass(
  name: string,
  code: string,
  teacherId: string,
): Promise<ClassesRow[]> {
  const { data, error } = await supabase
    .from("classes")
    .insert({
      name,
      code,
      teacher_id: teacherId,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return data ?? [];
}
