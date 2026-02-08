import { redirect } from "next/navigation";
import { getUserWithStartup } from "@/lib/db";
import NewStartupClient from "./client";

export default async function NewStartupPage() {
  const { user, startup } = await getUserWithStartup();

  if (!user) {
    redirect("/login");
  }

  // If user already has a startup, redirect to dashboard
  if (startup) {
    redirect("/dashboard");
  }

  return <NewStartupClient />;
}
