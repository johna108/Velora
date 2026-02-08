import { redirect } from "next/navigation"
import { getUserWithStartup, getStartupTasks } from "@/lib/db"
import TasksPageContent from "./client"

export default async function TasksPage() {
  const { user, startup } = await getUserWithStartup()

  if (!user) {
    redirect("/login")
  }

  if (!startup) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No startup found. Create one first.</p>
      </div>
    )
  }

  const tasks = await getStartupTasks(startup.id)

  return <TasksPageContent initialTasks={tasks} startupId={startup.id} />
}
