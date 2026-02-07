"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "For individual founders just getting started.",
    features: [
      "Up to 10 tasks",
      "Basic analytics",
      "Feedback board (10 entries)",
      "1 user",
    ],
    cta: "Current Plan",
    isCurrent: true,
  },
  {
    name: "Pro",
    price: "$20",
    description: "For small teams looking to accelerate.",
    features: [
      "Unlimited tasks",
      "Advanced analytics",
      "Unlimited feedback",
      "Up to 5 users",
      "AI Task Generation",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    isFeatured: true,
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    description: "For larger organizations with custom needs.",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated account manager",
      "On-premise deployment option",
      "SAML/SSO",
    ],
    cta: "Contact Sales",
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">
          Pricing Plans
        </h1>
        <p className="text-muted-foreground mt-2">
          Choose the plan that's right for your startup's journey.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier) => (
          <Card key={tier.name} className={cn("flex flex-col", tier.isFeatured ? "border-primary ring-2 ring-primary" : "")}>
            <CardHeader className="pb-4">
              <CardTitle>{tier.name}</CardTitle>
              <div className="text-4xl font-bold pt-4">
                {tier.price}
                {tier.price !== "Contact Us" && tier.price !== "$0" && <span className="text-sm font-normal text-muted-foreground">/ month</span>}
              </div>
              <CardDescription className="pt-2">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={tier.isFeatured ? "default" : "outline"} disabled={tier.isCurrent}>
                {tier.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
