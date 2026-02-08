"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser } from "@/lib/db"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function selectStartup(startupId: string) {
  const cookieStore = await cookies()
  cookieStore.set("active_startup_id", startupId, { path: "/", httpOnly: true, secure: true })
  redirect("/dashboard")
}

export async function createOrganization(formData: FormData) {
  const user = await getAuthUser()
  if (!user) return { message: "Not authenticated", error: true }

  const name = formData.get("name") as string
  if (!name) return { message: "Name is required", error: true }

  const supabase = await createClient()
  const { error } = await supabase
    .from("organizations")
    .insert({ owner_id: user.id, name })

  if (error) return { message: error.message, error: true }

  revalidatePath("/organizations")
  return { message: "Organization created", error: false }
}

export async function createProject(formData: FormData) {
  const user = await getAuthUser()
  if (!user) return { message: "Not authenticated", error: true }

  const orgId = formData.get("orgId") as string
  const name = formData.get("name") as string
  const stage = formData.get("stage") as string
  const industry = formData.get("industry") as string
  const description = formData.get("description") as string
  const business_model = formData.get("business_model") as string
  const target_market = formData.get("target_market") as string
  const problem = formData.get("problem") as string
  const solution = formData.get("solution") as string
  const roadmap = formData.get("roadmap") as string
  const traction = formData.get("traction") as string
  
  if (!name || !orgId) return { message: "Name and Organization ID are required", error: true }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("startups")
    .insert({
      user_id: user.id,
      organization_id: orgId,
      name,
      stage: stage || "Idea",
      industry: industry || "Technology",
      description: description || "",
      business_model: business_model || "",
      target_market: target_market || "",
      problem: problem || "",
      solution: solution || "",
      roadmap: roadmap || "",
      traction: traction || "",
      is_public: false
    })
    .select()
    .single()

  if (error) return { message: error.message, error: true }

  revalidatePath("/organizations")
  
  // Auto-select the new project
  const cookieStore = await cookies()
  cookieStore.set("active_startup_id", data.id, { path: "/", httpOnly: true, secure: true })

  return { message: "Project created", error: false, redirect: "/dashboard" }
}

export async function deleteOrganization(formData: FormData) {
  const user = await getAuthUser()
  if (!user) return { message: "Not authenticated", error: true }

  const orgId = formData.get("orgId") as string
  if (!orgId) return { message: "Organization ID is required", error: true }

  const supabase = await createClient()

  // Ensure user owns the org
  const { error, count } = await supabase
    .from("organizations")
    .delete({ count: "exact" })
    .eq("id", orgId)
    .eq("owner_id", user.id)

  if (error) {
     console.error("Delete Org Error:", error)
     return { message: "Failed to delete organization: " + error.message, error: true }
  }

  if (count === 0) {
      return { message: "Organization not found or permission denied", error: true }
  }

  revalidatePath("/organizations")
  return { message: "Organization deleted", error: false }
}

export async function deleteProject(formData: FormData) {
  const user = await getAuthUser()
  if (!user) return { message: "Not authenticated", error: true }

  const projectId = formData.get("projectId") as string
  if (!projectId) return { message: "Project ID is required", error: true }

  const supabase = await createClient()

  // Ensure user owns the project (via startup.user_id check implicitly by RLS, 
  // but explicit owner check is good practice if RLS wasn't perfect, 
  // though here we rely on RLS policies usually).
  // Assuming RLS on startups table allows delete for owner.
  
  const { error, count } = await supabase
    .from("startups")
    .delete({ count: "exact" })
    .eq("id", projectId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Delete Project Error:", error)
    return { message: "Failed to delete project: " + error.message, error: true }
  }

  if (count === 0) {
     return { message: "Project not found or permission denied", error: true }
  }

  revalidatePath("/organizations")
  return { message: "Project deleted", error: false }
}
