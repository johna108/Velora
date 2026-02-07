"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { getAITasks } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, Sparkles } from "lucide-react";
import { startupProfileData } from "@/lib/data";

const FormSchema = z.object({
  startupProfile: z.string().min(50, {
    message: "Startup profile must be at least 50 characters.",
  }),
});

const defaultProfile = `Our startup, ${startupProfileData.name}, is in the ${startupProfileData.industry} sector. We are currently at the ${startupProfileData.stage} stage. Our business model is ${startupProfileData.businessModel}, and we are targeting ${startupProfileData.targetMarket}. Our goal is to solve the problem of unstructured planning for early-stage founders by providing a unified digital platform.`;

export default function AiInsightsPage() {
  const [isPending, startTransition] = useTransition();
  const [generatedTasks, setGeneratedTasks] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startupProfile: defaultProfile,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setGeneratedTasks([]);
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
        toast({
          title: "Success!",
          description: "AI has generated your tasks.",
        });
      }
    });
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
        <CardContent>
          {isPending ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : generatedTasks.length > 0 ? (
            <ul className="space-y-3">
              {generatedTasks.map((task, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-1 text-primary" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p>Your generated tasks will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
