'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Feedback } from "@/lib/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createFeedback, deleteFeedback } from "./actions";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "text-primary fill-primary"
              : "text-muted-foreground opacity-30"
          }`}
        />
      ))}
    </div>
  );
}

const addFeedbackSchema = z.object({
  from_name: z.string().min(1, { message: "Please enter who the feedback is from." }),
  content: z.string().min(10, { message: "Message must be at least 10 characters." }),
  type: z.enum(["Internal", "External"], {
    required_error: "You need to select a feedback type.",
  }),
  metric: z.string().refine((val) => !isNaN(parseInt(val, 10)), {
    message: "Please select a rating.",
  }),
});

interface FeedbackPageContentProps {
  initialFeedback: Feedback[];
  startupId: string;
}

export default function FeedbackPageContent({ initialFeedback, startupId }: FeedbackPageContentProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedback);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addFeedbackSchema>>({
    resolver: zodResolver(addFeedbackSchema),
    defaultValues: {
      from_name: "",
      content: "",
      type: "Internal",
      metric: "5",
    },
  });

  async function onSubmit(values: z.infer<typeof addFeedbackSchema>) {
    // Optimistic Update
    const tempId = `temp-${Date.now()}`;
    const newFeedback: Feedback = {
      id: tempId,
      startup_id: startupId,
      type: values.type as "Internal" | "External",
      content: values.content,
      from_name: values.from_name,
      metric: parseInt(values.metric, 10),
      created_at: new Date().toISOString(),
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);
    setIsDialogOpen(false);
    toast({
      title: "Feedback added!",
      description: "Thank you for the feedback.",
    });

    try {
        const created = await createFeedback({
            startup_id: startupId,
            type: values.type,
            content: values.content,
            from_name: values.from_name,
            metric: parseInt(values.metric, 10)
        });

        // Replace optimistic with real
        setFeedbacks((prev) => prev.map(f => f.id === tempId ? created : f));
        form.reset();
    } catch (error) {
        setFeedbacks((prev) => prev.filter(f => f.id !== tempId));
        toast({
            title: "Error",
            description: "Failed to save feedback.",
            variant: "destructive"
        });
        setIsDialogOpen(true); // Re-open
    }
  }

  const handleDelete = async (id: string) => {
    // Optimistic delete
    const feedbackToDelete = feedbacks.find(f => f.id === id);
    setFeedbacks((prev) => prev.filter(f => f.id !== id));
    
    try {
        await deleteFeedback(id);
        toast({ title: "Deleted", description: "Feedback removed." });
    } catch (error) {
        if (feedbackToDelete) setFeedbacks((prev) => [...prev, feedbackToDelete]);
        toast({
             title: "Error",
             description: "Failed to delete feedback.",
            variant: "destructive" 
        });
    }
  }

  const internalFeedback = feedbacks.filter((f) => f.type === "Internal");
  const externalFeedback = feedbacks.filter((f) => f.type === "External");
  const avgRating = feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + f.metric, 0) / feedbacks.length).toFixed(1) : "0";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Feedback & Validation</h1>
          <p className="text-muted-foreground">Collect and track feedback from your users and team.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Add Feedback</DialogTitle>
                  <DialogDescription>
                    Collect feedback from your users or team members.
                  </DialogDescription>
                </DialogHeader>

                <FormField
                  control={form.control}
                  name="from_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <Input placeholder="Name or email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Internal" id="internal" />
                            <label htmlFor="internal" className="cursor-pointer">Internal</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="External" id="external" />
                            <label htmlFor="external" className="cursor-pointer">External</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Share your feedback..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metric"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating} Star{rating !== 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Save Feedback</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbacks.length}</div>
            <p className="text-xs text-muted-foreground">pieces of feedback collected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating}/5</div>
            <p className="text-xs text-muted-foreground">average satisfaction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Internal vs External</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{internalFeedback.length} / {externalFeedback.length}</div>
            <p className="text-xs text-muted-foreground">internal / external feedback</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({feedbacks.length})</TabsTrigger>
          <TabsTrigger value="internal">Internal ({internalFeedback.length})</TabsTrigger>
          <TabsTrigger value="external">External ({externalFeedback.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id} className="group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{feedback.from_name}</CardTitle>
                    <CardDescription>{feedback.type} Feedback</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <StarRating rating={feedback.metric} />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(feedback.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{feedback.content}</p>
              </CardContent>
            </Card>
          ))}
          {feedbacks.length === 0 && (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">No feedback yet. Add your first feedback!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="internal" className="space-y-4">
          {internalFeedback.map((feedback) => (
            <Card key={feedback.id} className="group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{feedback.from_name}</CardTitle>
                    <CardDescription>Internal Feedback</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <StarRating rating={feedback.metric} />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(feedback.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{feedback.content}</p>
              </CardContent>
            </Card>
          ))}
          {internalFeedback.length === 0 && (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">No internal feedback yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="external" className="space-y-4">
          {externalFeedback.map((feedback) => (
            <Card key={feedback.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{feedback.from_name}</CardTitle>
                    <CardDescription>External Feedback</CardDescription>
                  </div>
                  <StarRating rating={feedback.metric} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{feedback.content}</p>
              </CardContent>
            </Card>
          ))}
          {externalFeedback.length === 0 && (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">No external feedback yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
