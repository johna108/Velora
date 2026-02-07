"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { tasksData, teamMembers, type Task } from "@/lib/data";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

type TaskStatus = "Todo" | "In Progress" | "Done";

type TaskColumnProps = {
  title: TaskStatus;
  tasks: Task[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void;
};

function TaskColumn({ title, tasks, onDragStart, onDragOver, onDrop }: TaskColumnProps) {
  return (
    <div
      className="flex flex-col gap-4 p-4 bg-secondary/50 rounded-lg min-h-[200px]"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, title)}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-sm text-muted-foreground">{tasks.length} tasks</span>
      </div>
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <Card 
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            className="cursor-move"
          >
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

const taskFormSchema = z.object({
    title: z.string().min(1, "Title is required."),
    description: z.string().optional(),
    assignee: z.string().optional(),
});


export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
        title: "",
        description: "",
        assignee: "",
    },
  });

  function onSubmit(values: z.infer<typeof taskFormSchema>) {
    const assignee = teamMembers.find(member => member.name === values.assignee);
    const newTask: Task = {
        id: `task-${Date.now()}`,
        title: values.title,
        description: values.description || "",
        status: "Todo",
        assignee: assignee,
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    toast({
        title: "Task created!",
        description: `"${values.title}" has been added to your board.`,
    });
    form.reset();
    setIsDialogOpen(false);
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    const taskId = e.dataTransfer.getData("taskId");
    setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
  };

  const todoTasks = tasks.filter((task) => task.status === "Todo");
  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  );
  const doneTasks = tasks.filter((task) => task.status === "Done");

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold font-headline">Task Board</h1>
                <p className="text-muted-foreground">Drag and drop tasks to change their status.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                            <DialogDescription>
                                Fill in the details for the new task. Click save when you're done.
                            </DialogDescription>
                            </DialogHeader>
                            
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Design landing page" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Add more details about the task" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="assignee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assignee</FormLabel>
                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a team member" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {teamMembers.map(member => (
                                                    <SelectItem key={member.name} value={member.name}>{member.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            
                            <DialogFooter>
                            <Button type="submit">Save Task</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

        </div>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <TaskColumn title="Todo" tasks={todoTasks} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} />
        <TaskColumn title="In Progress" tasks={inProgressTasks} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} />
        <TaskColumn title="Done" tasks={doneTasks} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} />
      </div>
    </div>
  );
}
