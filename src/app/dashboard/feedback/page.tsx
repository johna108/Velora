import { redirect } from "next/navigation"
import { getUserWithStartup, getStartupFeedback } from "@/lib/db"
import FeedbackPageContent from "./client"

export default async function FeedbackPage() {
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

  const feedback = await getStartupFeedback(startup.id)

  return <FeedbackPageContent initialFeedback={feedback} startupId={startup.id} />
}
