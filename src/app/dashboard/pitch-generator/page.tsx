import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { startupProfileData } from "@/lib/data";
import { FileText } from "lucide-react";

type PitchSectionProps = {
    title: string;
    children: React.ReactNode;
};

function PitchSection({ title, children }: PitchSectionProps) {
    return (
        <div>
            <h3 className="text-xl font-semibold font-headline text-primary mb-2">{title}</h3>
            <div className="prose prose-sm max-w-none text-muted-foreground">{children}</div>
        </div>
    )
}

export default function PitchGeneratorPage() {
    const {name, industry, targetMarket, businessModel} = startupProfileData;
  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="text-primary" />
            AI Investor Pitch Generator
          </CardTitle>
          <CardDescription>
            Use your startup data to generate a compelling pitch outline. This is a mock-up, but it shows the potential.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <PitchSection title="1. Problem">
                <p>Early-stage startups often struggle not because of a lack of ideas, but due to poor execution, unstructured planning, and the absence of data-driven decision-making. Founders rely on a fragmented set of tools, leading to inefficiency and a lack of focus on what truly matters for growth.</p>
            </PitchSection>
            <PitchSection title="2. Solution">
                <p>{name} is a unified digital platform that acts as an operational workspace for early-stage founders. We help them manage execution, validate ideas, collaborate with their teams, and gain actionable insights to scale efficiently. Our solution is intuitive, scalable, and founder-centric, designed to mirror real-world startup workflows.</p>
            </PitchSection>
            <PitchSection title="3. Market Size">
                <p>The global market for startup and small business software is rapidly expanding. We are initially targeting the thousands of new startups emerging from tech incubators and universities, with a focus on the {industry} sector. Our specific niche is founders who need a structured approach to execution, a significant and underserved segment of the market.</p>
            </PitchSection>
             <PitchSection title="4. Product">
                <p>Our core product features include:</p>
                <ul>
                    <li><strong>Task & Milestone Tracking:</strong> A visual system to manage tasks and track progress against key milestones.</li>
                    <li><strong>Feedback & Validation:</strong> Tools to collect and analyze internal and external feedback to iterate on ideas.</li>
                    <li><strong>Analytics Dashboard:</strong> Clear, meaningful data on progress, trends, and team performance.</li>
                    <li><strong>AI-Powered Insights:</strong> Smart suggestions for tasks and growth strategies based on startup data.</li>
                </ul>
            </PitchSection>
             <PitchSection title="5. Business Model">
                <p>Our business model is a {businessModel}. We offer a free tier for individual founders and small teams, with premium subscription plans that unlock advanced features like unlimited AI insights, team management roles, and in-depth analytics. This freemium approach allows us to capture a wide user base and upsell as startups grow.</p>
            </PitchSection>
            <PitchSection title="6. Roadmap">
                <p>Our 12-month roadmap includes:</p>
                <ul>
                    <li><strong>Q1:</strong> Launch public beta and onboard first 100 startups.</li>
                    <li><strong>Q2:</strong> Integrate with popular developer tools like GitHub and Slack.</li>
                    <li><strong>Q3:</strong> Introduce advanced collaboration and resource planning features.</li>
                    <li><strong>Q4:</strong> Develop a mobile application and expand our AI capabilities.</li>
                </ul>
            </PitchSection>
        </CardContent>
        <CardFooter className="flex gap-2">
            <Button>Generate Pitch</Button>
            <Button variant="outline">Download as PDF</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
