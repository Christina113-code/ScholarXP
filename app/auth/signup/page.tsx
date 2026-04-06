import { redirect } from "next/navigation";

// Backwards-compatible redirect: your app uses the top-level `/signup`.
export default function AuthSignupRedirectPage() {
  redirect("/signup");
}
