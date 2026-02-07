import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tasksData, teamMembers } from "@/lib/data";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TaskColumnProps = {
  title: "Todo" | "In Progress" | "Done";
  tasks: typeof tasksData;
};

function TaskColumn({ title, tasks }: TaskColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-sm text-muted-foreground">{tasks.length} tasks</span>
      </div>
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <h4 className="font-semibold leading-none">{task.title}</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end">
              {task.assignee && task.assignee.avatar && (
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={task.assignee.avatar.imageUrl} alt={task.assignee.name} data-ai-hint={task.assignee.avatar.imageHint} />
                    <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const todoTasks = tasksData.filter((task) => task.status === "Todo");
  const inProgressTasks = tasksData.filter(
    (task) => task.status === "In Progress"
  );
  const doneTasks = tasksData.filter((task) => task.status === "Done");

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold font-headline">Task Board</h1>
                <p className="text-muted-foreground">Drag and drop tasks to change their status.</p>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new task. Click save when you're done.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                        Title
                        </Label>
                        <Input id="title" placeholder="e.g. Design landing page" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                        Description
                        </Label>
                        <Textarea id="description" placeholder="Add more details about the task" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="assignee" className="text-right">
                        Assignee
                        </Label>
                         <Select>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a team member" />
                            </SelectTrigger>
                            <SelectContent>
                                {teamMembers.map(member => (
                                    <SelectItem key={member.name} value={member.name}>{member.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    </div>
                    <DialogFooter>
                    <Button type="submit">Save Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <TaskColumn title="Todo" tasks={todoTasks} />
        <TaskColumn title="In Progress" tasks={inProgressTasks} />
        <TaskColumn title="Done" tasks={doneTasks} />
      </div>
    </div>
  );
}
