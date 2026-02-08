"use client"

import { useMemo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

interface DashboardChartsProps {
  tasks: any[]
}

export function DashboardCharts({ tasks }: DashboardChartsProps) {
  // 1. Task Status Distribution
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {}
    tasks.forEach((task) => {
      const status = task.status || "Unknown"
      counts[status] = (counts[status] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [tasks])

  // 2. Team Workload (Assignee)
  const workloadData = useMemo(() => {
    const counts: Record<string, number> = {}
    tasks.forEach((task) => {
      // Check if assignee is an object (joined) or just an ID
      const assigneeName = task.assignee?.name || "Unassigned"
      counts[assigneeName] = (counts[assigneeName] || 0) + 1
    })
    return Object.entries(counts).map(([name, tasks]) => ({ name, tasks }))
  }, [tasks])

  // 3. Priority Distribution
  const priorityData = useMemo(() => {
      const priorityWeights = { 'high': 3, 'medium': 2, 'low': 1, 'none': 0 };
      const counts: Record<string, number> = {}
      tasks.forEach((task) => {
          const priority = (task.priority || "None").charAt(0).toUpperCase() + (task.priority || "none").slice(1)
          counts[priority] = (counts[priority] || 0) + 1
      })
       return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [tasks])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
      {/* Team Workload - Takes up 4 columns */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Team Workload</CardTitle>
          <CardDescription>Number of tasks assigned per team member</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`} 
                />
                <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                />
                <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Task Status - Takes up 3 columns */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Task Status</CardTitle>
          <CardDescription>Distribution of tasks by current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
       {/* Priority Breakdown - Takes up full width or remaining space */}
       <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Priority Breakdown</CardTitle>
          <CardDescription>Tasks organized by priority level</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priorityData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
       </Card>
    </div>
  )
}
