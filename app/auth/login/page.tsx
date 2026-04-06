import { redirect } from "next/navigation";

// Backwards-compatible redirect: your app uses the top-level `/login`.
export default function AuthLoginRedirectPage() {
  redirect("/login");
}
