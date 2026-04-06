import { redirect } from "next/navigation";

// Placeholder route. Teacher classes are shown on the main teacher dashboard.
export default function TeacherClassesPlaceholder() {
  redirect("/dashboard/teacher");
}
