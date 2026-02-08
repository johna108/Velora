import { redirect } from "next/navigation";
import { getAuthUser, getUserOrganization } from "@/lib/db";
import LoginForm from "./form";

export default async function LoginPage() {
  const user = await getAuthUser();

  if (user) {
    const org = await getUserOrganization(user.id);
    if (!org) {
      redirect("/onboarding");
    }
    // Redirect to organization list instead of direct dashboard
    redirect("/organizations");
  }

  return <LoginForm />;
}
