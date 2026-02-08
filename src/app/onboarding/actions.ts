"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getAuthUser } from "@/lib/db"

export async function completeOnboarding(prevState: any, formData: FormData) {
  const user = await getAuthUser()
  if (!user) {
    return { message: "Not authenticated", error: true }
  }

  const orgName = formData.get("orgName") as string

  if (!orgName) {
    return { message: "Organization name is required", error: true }
  }

  const supabase = await createClient()

  // 1. Create Organization
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({ 
        owner_id: user.id, 
        name: orgName 
    })
    .select()
    .single()

  if (orgError) {
    console.error("Org Error:", orgError)
    return { message: "Failed to create organization: " + orgError.message, error: true }
  }

  revalidatePath("/")
  redirect("/dashboard")
}
