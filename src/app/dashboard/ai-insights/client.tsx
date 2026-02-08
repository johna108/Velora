"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { getAITasks } from "@/app/actions";
import { saveGeneratedTasks } from "../tasks/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, Sparkles, ArrowRight } from "lucide-react";
import type { Startup } from "@/lib/db";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  startupProfile: z.string().min(50, {
    message: "Startup profile must be at least 50 characters.",
  }),
});

interface AiInsightsClientProps {
    startup: Startup;
}

export default function AiInsightsClient({ startup }: AiInsightsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [generatedTasks, setGeneratedTasks] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const defaultProfile = `Our startup, ${startup.name}, is in the ${startup.industry} sector. We are currently at the ${startup.stage} stage. Our business model is ${startup.business_model}, and we are targeting ${startup.target_market}. Our goal is to solve the problem of unstructured planning for early-stage founders by providing a unified digital platform.`;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startupProfile: defaultProfile,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setGeneratedTasks([]);
    setSelectedIndices(new Set());
    startTransition(async () => {
      const result = await getAITasks(data);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else if (result.tasks) {
        setGeneratedTasks(result.tasks);
        // Default select all
        setSelectedIndices(new Set(result.tasks.map((_, i) => i)));
        toast({
          title: "Success!",
          description: "AI has generated your tasks. Select the ones you want to keep.",
        });
      }
    });
  }

  const toggleTask = (index: number) => {
    const next = new Set(selectedIndices);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelectedIndices(next);
  };

  const handleSave = async () => {
    if (selectedIndices.size === 0) {
        toast({
            title: "No tasks selected",
            description: "Please select at least one task to proceed.",
            variant: "destructive"
        });
        return;
    }
    
    setIsSaving(true);
    const tasksToSave = generatedTasks.filter((_, i) => selectedIndices.has(i));
    
    try {
        const result = await saveGeneratedTasks(startup.id, tasksToSave);
        
        if (result?.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Tasks saved to your board." });
            router.push('/dashboard/tasks');
        }
    } catch (error) {
         toast({ title: "Error", description: "Failed to save tasks", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI-Powered Task Generation
          </CardTitle>
          <CardDescription>
            Describe your startup, and our AI will suggest actionable tasks to
            help you grow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="startupProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Startup Profile</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your startup in detail..."
                        className="resize-none min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Tasks"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Suggested Tasks</CardTitle>
          <CardDescription>
            Here are the tasks suggested by our AI assistant.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          {isPending ? (
            <div className="flex justify-center items-center h-full min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : generatedTasks.length > 0 ? (
            <>
              <div className="flex-1 overflow-y-auto pr-2 max-h-[400px]">
                <ul className="space-y-4">
                  {generatedTasks.map((task, index) => (
                    <li key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border">
                      <Checkbox 
                        id={`task-${index}`} 
                        checked={selectedIndices.has(index)}
                        onCheckedChange={() => toggleTask(index)}
                        className="mt-1"
                      />
                      <label 
                        htmlFor={`task-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full leading-relaxed"
                      >
                        {task}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6 mt-auto border-t">
                  <Button className="w-full" onClick={handleSave} disabled={isSaving || selectedIndices.size === 0}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                    Proceed with {selectedIndices.size} Tasks
                  </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center h-full">
              <Sparkles className="h-12 w-12 mb-4 opacity-20" />
              <p>Your generated tasks will appear here.</p>
              <p className="text-sm mt-2">Adjust the profile on the left to get better results.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
