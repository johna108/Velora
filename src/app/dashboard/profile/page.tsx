import { redirect } from "next/navigation";
import { getUserWithStartup, getTeamMembers } from "@/lib/db";
import ProfileClient from "./client";

export default async function ProfilePage() {
  const { user, startup } = await getUserWithStartup();

  if (!user) {
    redirect("/login");
  }

  if (!startup) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No startup found. Please create one on the Dashboard.</p>
      </div>
    );
  }

  const team = await getTeamMembers(startup.id);

  return <ProfileClient startup={startup} team={team} />;
}
