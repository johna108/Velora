"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStartupAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const industry = formData.get("industry") as string;
  const stage = formData.get("stage") as string;
  const targetMarket = formData.get("targetMarket") as string;
  const businessModel = formData.get("businessModel") as string;

  if (!name || name.trim().length < 2) {
    return { error: "Startup name is required (at least 2 characters)" };
  }

  const { data, error } = await supabase
    .from("startups")
    .insert([{
      user_id: session.user.id,
      name: name.trim(),
      description: description?.trim() || null,
      industry: industry?.trim() || null,
      stage: stage || "Idea",
      target_market: targetMarket?.trim() || null,
      business_model: businessModel?.trim() || null,
      is_public: false,
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating startup:", error);
    return { error: "Failed to create startup. Please try again." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
