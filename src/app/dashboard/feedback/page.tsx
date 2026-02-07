import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { feedbackData } from "@/lib/data";
import { Star, MessageSquare, Users } from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function FeedbackPage() {
    const internalFeedback = feedbackData.filter(fb => fb.type === 'Internal');
    const externalFeedback = feedbackData.filter(fb => fb.type === 'External');
  return (
    <div className="flex flex-col gap-6">
       <div>
            <h1 className="text-3xl font-bold font-headline">Feedback & Validation</h1>
            <p className="text-muted-foreground">Collect and analyze feedback to validate your ideas.</p>
        </div>
      <Tabs defaultValue="all">
        <div className="flex items-center">
            <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="internal">Internal</TabsTrigger>
                <TabsTrigger value="external">External</TabsTrigger>
            </TabsList>
            <div className="ml-auto">
                <Button>Request Feedback</Button>
            </div>
        </div>

        <TabsContent value="all" className="grid md:grid-cols-2 gap-4 mt-4">
            {feedbackData.map((feedback) => (
                <Card key={feedback.id}>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>From: {feedback.from}</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${feedback.type === 'Internal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{feedback.type}</span>
                        </CardTitle>
                        <CardDescription>
                            <StarRating rating={feedback.metric} />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">&quot;{feedback.content}&quot;</p>
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
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">{feedback.type}</span>
                        </CardTitle>
                        <CardDescription>
                            <StarRating rating={feedback.metric} />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">&quot;{feedback.content}&quot;</p>
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
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-800">{feedback.type}</span>
                        </CardTitle>
                        <CardDescription>
                            <StarRating rating={feedback.metric} />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">&quot;{feedback.content}&quot;</p>
                    </CardContent>
                </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
