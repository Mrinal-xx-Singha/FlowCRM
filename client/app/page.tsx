import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to dashboard (if authenticated) or login (if not)
  // For now, we redirect to dashboard
  redirect("/dashboard");
}
