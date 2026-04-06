import { redirect } from "next/navigation";

// Root entry point: let the dashboard route apply auth + role redirects.
export default function Home() {
  redirect("/dashboard");
}
