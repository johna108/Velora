'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Task } from "@/lib/db";
import { PlusCircle, MoreHorizontal, GripVertical, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createTask, updateTask, deleteTask } from "./actions";

type TaskStatus = "Todo" | "In Progress" | "Done";

type TaskColumnProps = {
  title: TaskStatus;
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
};

function TaskColumn({ title, tasks, onDragOver, onDrop, onEditTask, onDeleteTask }: TaskColumnProps) {
  const statusColors = {
    "Todo": "border-l-yellow-500",
    "In Progress": "border-l-blue-500",
    "Done": "border-l-green-500",
  };

  return (
    <div 
      className="flex flex-col gap-4 p-4 bg-card/20 rounded-xl min-h-[600px] border border-border/40 transition-all duration-300 hover:bg-card/30 hover:border-primary/20"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, title)}
    >
      <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm p-2 -m-2 rounded-lg">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${
            title === "Todo" ? "bg-yellow-500" :
            title === "In Progress" ? "bg-blue-500" :
            "bg-green-500"
          }`}></div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <span className="text-xs font-medium bg-muted/50 px-2.5 py-1 rounded-full text-muted-foreground">{tasks.length}</span>
      </div>
      
      <div className="flex flex-col gap-3 flex-1">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-border/40 rounded-lg">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("taskId", task.id);
                e.dataTransfer.setData("fromStatus", task.status);
              }}
              className="group cursor-grab active:cursor-grabbing"
            >
              <Card className={`border-l-4 ${statusColors[task.status]} hover:shadow-lg hover:border-primary/50 transition-all duration-200 bg-background/80 hover:bg-background`}>
                <CardHeader className="flex flex-row items-start justify-between p-3 pb-2">
                  <div className="flex items-start gap-2 flex-1">
                    <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold leading-tight text-sm break-words">{task.title}</h4>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditTask(task)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                {task.description && (
                  <CardContent className="p-3 pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                  </CardContent>
                )}
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const taskFormSchema = z.object({
    title: z.string().min(1, "Title is required."),
    description: z.string().optional(),
});

interface TasksPageProps {
  initialTasks: Task[];
  startupId: string;
}

export default function TasksPageContent({ initialTasks, startupId }: TasksPageProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
        title: "",
        description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof taskFormSchema>) => {
    // Close dialog immediately
    setIsDialogOpen(false);

    if (editingTask) {
      // Optimistic Update existing task
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === editingTask.id
            ? {
                ...t,
                title: values.title,
                description: values.description || undefined,
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );
      
      try {
        await updateTask(editingTask.id, {
            title: values.title,
            description: values.description,
            updated_at: new Date().toISOString(),
        });
        toast({
            title: "Task updated!",
            description: `"${values.title}" has been updated.`,
        });
      } catch (error) {
        toast({
            title: "Error",
            description: "Failed to update task on server.",
            variant: "destructive"
        });
      }

    } else {
      // Create new task
      const tempId = `temp-${Date.now()}`;
      const newTask: Task = {
        id: tempId,
        startup_id: startupId,
        title: values.title,
        description: values.description || undefined,
        status: "Todo",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Optimistic add
      setTasks(prevTasks => [...prevTasks, newTask]);

      try {
        const created = await createTask({
            startup_id: startupId,
            title: values.title,
            description: values.description,
            status: "Todo"
        });
        
        // Replace temp task with real one
        setTasks(prevTasks => prevTasks.map(t => t.id === tempId ? created : t));

        toast({
            title: "Task created!",
            description: `"${values.title}" has been added to your board.`,
        });
      } catch (error) {
          setTasks(prevTasks => prevTasks.filter(t => t.id !== tempId)); // Rollback
          toast({
            title: "Error",
            description: "Failed to create task on server.",
            variant: "destructive"
          });
      }
    }
    
    // Reset form and clear editing state after the dialog close animation (300ms)
    // This prevents the Dialog content from flickering/changing during the fade-out
    // and avoids potential focus trapping issues.
    setTimeout(() => {
      setEditingTask(null);
      form.reset({
        title: "",
        description: "",
      });
    }, 300);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    form.setValue("title", task.title);
    form.setValue("description", task.description || "");
    setIsDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    // Optimistic delete
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    
    try {
        await deleteTask(taskId);
        toast({
            title: "Task deleted!",
            description: taskToDelete ? `"${taskToDelete.title}" has been removed.` : "Task removed from board.",
        });
    } catch (error) {
        // Rollback
        if (taskToDelete) setTasks(prevTasks => [...prevTasks, taskToDelete]);
        toast({
            title: "Error",
            description: "Failed to delete task.",
            variant: "destructive"
        });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;
    if (task.status === status) return;

    // Optimistic update
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              status,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );

    try {
        await updateTask(taskId, { status, updated_at: new Date().toISOString() });
        toast({
            title: "Task moved!",
            description: `"${task.title}" moved to ${status}.`,
        });
    } catch (error) {
        // Rollback
        setTasks(prevTasks =>
            prevTasks.map(t =>
              t.id === taskId
                ? { ...t, status: task.status } // Revert to old status
                : t
            )
        );
        toast({
            title: "Error",
            description: "Failed to update task status.",
            variant: "destructive"
        });
    }
  };

  const todoTasks = tasks.filter((task) => task.status === "Todo");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const doneTasks = tasks.filter((task) => task.status === "Done");

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold font-headline">Task Board</h1>
                <p className="text-muted-foreground">Drag tasks between columns to organize your work. Total: {tasks.length} tasks</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                // Wait for animation to finish before resetting state
                setTimeout(() => {
                  setEditingTask(null);
                  form.reset({
                    title: "",
                    description: "",
                  });
                }, 300);
              }
            }}>
                <DialogTrigger asChild>
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" /> Add Task
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <DialogHeader>
                            <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
                            <DialogDescription>
                                {editingTask ? "Update your task details." : "Create a new task for your startup."}
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
                            
                            <DialogFooter>
                            <Button type="submit">{editingTask ? "Update Task" : "Create Task"}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

        </div>
      <div className="grid md:grid-cols-3 gap-6 items-start">
        <TaskColumn 
          title="Todo" 
          tasks={todoTasks}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
        <TaskColumn 
          title="In Progress" 
          tasks={inProgressTasks}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
        <TaskColumn 
          title="Done" 
          tasks={doneTasks}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
}
