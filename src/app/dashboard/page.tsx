import { redirect } from "next/navigation"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Trophy, Users, Star, Rocket } from "lucide-react"
import { getDashboardData } from "@/lib/db"
import { DashboardCharts } from "./components/dashboard-charts"
import ProfileClient from "./profile/client"

export default async function DashboardPage() {
  const { user, startup, tasks, feedback } = await getDashboardData()

  if (!user) {
    redirect("/login")
  }

  if (startup && (!startup.description || !startup.business_model)) {
    // This state should theoretically not be reached as often now that creation requires description
    // But keeping it as fallback or for old projects
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Let's build your profile</h1>
            <p className="text-muted-foreground mb-8">Tell us more about {startup.name} to unlock AI insights.</p>
            <ProfileClient startup={startup} team={[]} />
        </div>
    )
  }

  if (!startup) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Welcome to Velora!</CardTitle>
            <CardDescription>
              Create your startup profile to start tracking tasks, gathering feedback, and generating AI-powered insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild size="lg">
              <Link href="/dashboard/new-startup">
                <Rocket className="mr-2 h-4 w-4" />
                Create Your Startup
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'Todo').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done: tasks.filter(t => t.status === 'Done').length,
  }

  const feedbackScore = feedback.length > 0
    ? feedback.reduce((sum, f) => sum + f.metric, 0) / feedback.length
    : 0

  // Mock data for chart - can be enhanced with real data
  const chartData = [
    { month: 'Jan', completed: 0 },
    { month: 'Feb', completed: 0 },
    { month: 'Mar', completed: 0 },
    { month: 'Apr', completed: 0 },
    { month: 'May', completed: 0 },
    { month: 'Jun', completed: tasksByStatus.done },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksByStatus.done}</div>
            <p className="text-xs text-muted-foreground">
              out of {tasksByStatus.todo + tasksByStatus.inProgress + tasksByStatus.done} total tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Invite more to collaborate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback Entries</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedback.length}</div>
            <p className="text-xs text-muted-foreground">
              {feedback.length > 0 ? `Avg: ${feedbackScore.toFixed(1)}/5` : 'No feedback yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Startup Stage</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{startup.stage}</div>
            <p className="text-xs text-muted-foreground">{startup.industry}</p>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts tasks={tasks} />
    </div>
  )
}
