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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { feedbackData } from "@/lib/data";
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

const feedbackRequestSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
  type: z.enum(["Internal", "External"], {
    required_error: "You need to select a feedback type.",
  }),
});

export default function FeedbackPage() {
  const internalFeedback = feedbackData.filter((fb) => fb.type === "Internal");
  const externalFeedback = feedbackData.filter((fb) => fb.type === "External");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof feedbackRequestSchema>>({
    resolver: zodResolver(feedbackRequestSchema),
    defaultValues: {
      email: "",
      message: "",
      type: "External",
    },
  });

  function onSubmit(values: z.infer<typeof feedbackRequestSchema>) {
    console.log("Feedback Request Submitted:", values);
    toast({
      title: "Request Sent!",
      description: `Feedback request sent to ${values.email}.`,
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
                <Button>Request Feedback</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <DialogHeader>
                      <DialogTitle>Request Feedback</DialogTitle>
                      <DialogDescription>
                        Send a request to a team member or external user to get
                        their feedback.
                      </DialogDescription>
                    </DialogHeader>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="name@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., 'Could you please provide feedback on our new landing page design?'"
                              {...field}
                            />
                          </FormControl>
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
                      <Button type="submit">Send Request</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="all" className="grid md:grid-cols-2 gap-4 mt-4">
          {feedbackData.map((feedback) => (
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
