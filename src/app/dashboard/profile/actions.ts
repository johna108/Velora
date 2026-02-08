"use server";

import { updateStartup, addTeamMember, deleteTeamMember, type Startup, type TeamMember } from "@/lib/db";

import { revalidatePath } from "next/cache";

export async function updateStartupProfile(startupId: string, data: Partial<Startup>) {
  await updateStartup(startupId, data);
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/startups");
}

export async function inviteTeamMember(formData: FormData) {
  const startupId = formData.get("startupId") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as "Founder" | "Team Member";
  
  // Extract name from email for now as we don't have a name field in the invite form
  const name = email.split("@")[0];

  if (!startupId || !email || !role) return;

  await addTeamMember(startupId, {
    name,
    role,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
  });
  revalidatePath("/dashboard/profile");
}

export async function removeTeamMember(memberId: string) {
  await deleteTeamMember(memberId);
  revalidatePath("/dashboard/profile");
}
