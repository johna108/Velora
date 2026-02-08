import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export type Organization = {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Startup = {
  id: string;
  organization_id?: string | null;
  user_id: string;
  name: string;
  description?: string;
  industry: string;
  target_market: string;
  business_model: string;
  stage: "Idea" | "MVP" | "Pre-Seed" | "Seed";
  problem?: string;
  solution?: string;
  roadmap?: string;
  traction?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type TeamMember = {
  id: string;
  startup_id: string;
  name: string;
  role: "Founder" | "Team Member";
  avatar_url?: string;
  created_at: string;
};

export type Task = {
  id: string;
  startup_id: string;
  title: string;
  description?: string;
  status: "Todo" | "In Progress" | "Done";
  assignee_id?: string;
  created_at: string;
  updated_at: string;
};

export type Feedback = {
  id: string;
  startup_id: string;
  type: "Internal" | "External";
  content: string;
  from_name: string;
  metric: number;
  created_at: string;
};

// Get authenticated user - uses session from cookie (fast, no API call)
export async function getAuthUser() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
}

// Get user's startup
export async function getUserStartup(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("startups")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    // PGRST116 = no rows returned, which is normal for new users
    if (error.code !== "PGRST116") {
      console.error("Error fetching startup:", error);
    }
    return null;
  }

  return data as Startup;
}

// Get user with their startup in one call (optimized)
export async function getUserWithStartup() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return { user: null, startup: null };
  }

  // Check for active startup cookie
  const cookieStore = await cookies();
  const activeStartupId = cookieStore.get("active_startup_id")?.value;

  let query = supabase
    .from("startups")
    .select("*")
    .eq("user_id", session.user.id);

  if (activeStartupId) {
    query = query.eq("id", activeStartupId);
  }

  const { data: startup } = await query.limit(1).maybeSingle();

  return { 
    user: session.user, 
    startup: startup as Startup | null 
  };
}

// Get user's organizations with their startups
export async function getUserOrganizationsWithStartups(userId: string) {
  const supabase = await createClient();
  
  // Fetch orgs
  const { data: orgs, error: orgsError } = await supabase
    .from("organizations")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (orgsError) {
    console.error("Error fetching orgs:", orgsError);
    return [];
  }

  // Fetch all startups for this user (could be optimized to be per org)
  // Assuming startups have organization_id
  const { data: startups, error: startupsError } = await supabase
    .from("startups")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (startupsError) {
    console.error("Error fetching startups:", startupsError);
    return [];
  }

  // Map startups to orgs
  // Also include "No Organization" startups just in case
  const orgsWithStartups = orgs.map(org => ({
    ...org,
    startups: startups.filter(s => s.organization_id === org.id)
  }));

  return orgsWithStartups;
}

// Get dashboard data in a single optimized call
export async function getDashboardData() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return { user: null, startup: null, tasks: [], feedback: [] };
  }

  // Check for active startup cookie
  const cookieStore = await cookies();
  const activeStartupId = cookieStore.get("active_startup_id")?.value;

  let startupQuery = supabase
    .from("startups")
    .select("*")
    .eq("user_id", session.user.id);
    
  if (activeStartupId) {
    startupQuery = startupQuery.eq("id", activeStartupId);
  }

  // If no cookie, or cookie invalid, we grab the first one found (or single)
  // limit(1) handles the case where there are multiple but no ID specified
  const { data: startupData, error } = await startupQuery.limit(1).maybeSingle();
  
  const startup = startupData as Startup | null;

  if (!startup) {
    // If no startup found at all, return empty
    return { user: session.user, startup: null, tasks: [], feedback: [] };
  }

  // Fetch tasks and feedback for this specific startup
  const [tasksResult, feedbackResult] = await Promise.all([
    supabase
      .from("tasks")
      .select("*, assignee:team_members(*)")
      .eq("startup_id", startup.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("feedback")
      .select("*")
      .eq("startup_id", startup.id)
      .order("created_at", { ascending: false })
  ]);

  return {
    user: session.user,
    startup: startup,
    tasks: (tasksResult.data ?? []) as any[], // Type assertion for joined data
    feedback: (feedbackResult.data ?? []) as Feedback[]
  };
}

// Get startup by ID (with team members)
export async function getStartupWithTeam(startupId: string) {
  const supabase = await createClient();
  const { data: startup, error: startupError } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  if (startupError) {
    console.error("Error fetching startup:", startupError);
    return null;
  }

  const { data: team, error: teamError } = await supabase
    .from("team_members")
    .select("*")
    .eq("startup_id", startupId);

  if (teamError) {
    console.error("Error fetching team:", teamError);
  }

  return {
    startup: startup as Startup,
    team: (team || []) as TeamMember[],
  };
}

// Get team members
export async function getTeamMembers(startupId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("startup_id", startupId);

  if (error) {
    console.error("Error fetching team:", error);
    return [];
  }

  return (data || []) as TeamMember[];
}

// Get startup tasks
export async function getStartupTasks(startupId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("startup_id", startupId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  return (data || []) as Task[];
}

// Get startup feedback
export async function getStartupFeedback(startupId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("startup_id", startupId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feedback:", error);
    return [];
  }

  return (data || []) as Feedback[];
}

// Get public startups
export async function getPublicStartups() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("startups")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching public startups:", error);
    return [];
  }

  return (data || []) as Startup[];
}

// Create startup
export async function createStartup(
  userId: string,
  startup: Omit<Startup, "id" | "user_id" | "created_at" | "updated_at">
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("startups")
    .insert([{ ...startup, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error("Error creating startup:", error);
    return null;
  }

  return data as Startup;
}

// Update startup
export async function updateStartup(
  startupId: string,
  updates: Partial<Startup>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("startups")
    .update(updates)
    .eq("id", startupId)
    .select()
    .single();

  if (error) {
    console.error("Error updating startup:", error);
    return null;
  }

  return data as Startup;
}

// Add team member
export async function addTeamMember(
  startupId: string,
  member: Omit<TeamMember, "id" | "startup_id" | "created_at">
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .insert([{ ...member, startup_id: startupId }])
    .select()
    .single();

  if (error) {
    console.error("Error adding team member:", error);
    return null;
  }

  return data as TeamMember;
}

// Delete team member
export async function deleteTeamMember(memberId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    console.error("Error deleting team member:", error);
    return false;
  }
  return true;
}

// Create task
export async function createTask(
  startupId: string,
  task: Omit<Task, "id" | "startup_id" | "created_at" | "updated_at">
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ ...task, startup_id: startupId }])
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    return null;
  }

  return data as Task;
}

// Update task
export async function updateTask(taskId: string, updates: Partial<Task>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error);
    return null;
  }

  return data as Task;
}

// Add feedback
export async function addFeedback(
  startupId: string,
  feedback: Omit<Feedback, "id" | "startup_id" | "created_at">
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("feedback")
    .insert([{ ...feedback, startup_id: startupId }])
    .select()
    .single();

  if (error) {
    console.error("Error adding feedback:", error);
    return null;
  }

  return data as Feedback;
}

// Get user's organization
export async function getUserOrganization(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("owner_id", userId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching organization:", error);
    }
    return null;
  }

  return data as Organization;
}
