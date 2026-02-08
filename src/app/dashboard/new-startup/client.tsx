"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Rocket } from "lucide-react";
import { useActionState } from "react";
import { createStartupAction } from "./actions";

export default function NewStartupClient() {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await createStartupAction(formData);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
        return result;
      }
      return result;
    },
    null
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            Create Your Startup
          </CardTitle>
          <CardDescription>
            Tell us about your startup to get started with Velora.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Startup Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., TechVenture AI"
                required
                minLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Briefly describe what your startup does..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  placeholder="e.g., FinTech, HealthTech, EdTech"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select name="stage" defaultValue="Idea">
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Idea">Idea</SelectItem>
                    <SelectItem value="MVP">MVP</SelectItem>
                    <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                    <SelectItem value="Seed">Seed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetMarket">Target Market</Label>
              <Input
                id="targetMarket"
                name="targetMarket"
                placeholder="e.g., Small businesses, Enterprise, Consumers"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessModel">Business Model</Label>
              <Input
                id="businessModel"
                name="businessModel"
                placeholder="e.g., SaaS, Marketplace, Freemium"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  Create Startup
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
