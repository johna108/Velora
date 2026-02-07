"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { feedbackData, type Feedback } from "@/lib/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
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
  from: z.string().min(1, { message: "Please enter who the feedback is from." }),
  content: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
  type: z.enum(["Internal", "External"], {
    required_error: "You need to select a feedback type.",
  }),
  metric: z.string().refine((val) => !isNaN(parseInt(val, 10)), {
    message: "Please select a rating.",
  }),
});

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(feedbackData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const internalFeedback = feedbacks.filter((fb) => fb.type === "Internal");
  const externalFeedback = feedbacks.filter((fb) => fb.type === "External");

  const form = useForm<z.infer<typeof addFeedbackSchema>>({
    resolver: zodResolver(addFeedbackSchema),
    defaultValues: {
      from: "",
      content: "",
      type: "External",
      metric: "3",
    },
  });

  function onSubmit(values: z.infer<typeof addFeedbackSchema>) {
    const newFeedback: Feedback = {
      id: `fb-${Date.now()}`,
      from: values.from,
      content: values.content,
      type: values.type,
      metric: parseInt(values.metric, 10),
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);

    toast({
      title: "Feedback Added!",
      description: "The new feedback has been added to the board.",
    });
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Feedback & Validation
        </h1>
        <p className="text-muted-foreground">
          Collect and analyze feedback to validate your ideas.
        </p>
      </div>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="internal">Internal</TabsTrigger>
            <TabsTrigger value="external">External</TabsTrigger>
          </TabsList>
          <div className="ml-auto">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Feedback</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <DialogHeader>
                      <DialogTitle>Add New Feedback</DialogTitle>
                      <DialogDescription>
                        Fill in the details for the new feedback.
                      </DialogDescription>
                    </DialogHeader>

                    <FormField
                      control={form.control}
                      name="from"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="name@example.com or Team Member"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feedback</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., 'The new landing page design is great!'"
                              {...field}
                            />
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a rating" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 Star</SelectItem>
                              <SelectItem value="2">2 Stars</SelectItem>
                              <SelectItem value="3">3 Stars</SelectItem>
                              <SelectItem value="4">4 Stars</SelectItem>
                              <SelectItem value="5">5 Stars</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Feedback Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="External" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  External
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Internal" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Internal
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit">Add Feedback</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="all" className="grid md:grid-cols-2 gap-4 mt-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>From: {feedback.from}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      feedback.type === "Internal"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {feedback.type}
                  </span>
                </CardTitle>
                <CardDescription>
                  <StarRating rating={feedback.metric} />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  &quot;{feedback.content}&quot;
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="internal" className="grid md:grid-cols-2 gap-4 mt-4">
          {internalFeedback.map((feedback) => (
            <Card key={feedback.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>From: {feedback.from}</span>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                    {feedback.type}
                  </span>
                </CardTitle>
                <CardDescription>
                  <StarRating rating={feedback.metric} />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  &quot;{feedback.content}&quot;
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="external" className="grid md:grid-cols-2 gap-4 mt-4">
          {externalFeedback.map((feedback) => (
            <Card key={feedback.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>From: {feedback.from}</span>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent text-accent-foreground">
                    {feedback.type}
                  </span>
                </CardTitle>
                <CardDescription>
                  <StarRating rating={feedback.metric} />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  &quot;{feedback.content}&quot;
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
