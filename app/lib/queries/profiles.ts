// Supabase query helpers for `profiles`.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProfilesRow, Role } from "@/app/types/supabase";

export async function fetchMyProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<ProfilesRow | null> {
  const { data, error } = await supabase
    .from<ProfilesRow>("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function upsertMyProfileRole(
  supabase: SupabaseClient,
  input: {
    userId: string;
    role: Role;
    displayName: string | null;
  }
): Promise<ProfilesRow> {
  const { data, error } = await supabase
    .from<ProfilesRow>("profiles")
    .upsert(
      {
        id: input.userId,
        role: input.role,
        display_name: input.displayName,
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

