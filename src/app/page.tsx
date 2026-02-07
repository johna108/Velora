import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-image");

  const features = [
    "Task & Milestone Tracking",
    "Startup Profile & Workspace",
    "Feedback & Validation System",
    "Insightful Analytics Dashboard",
    "AI-Powered Task Generation",
    "Investor Pitch Assistance",
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M21.3333 2.66699H10.6667C9.95942 2.66699 9.28115 2.94795 8.78105 3.44805C8.28095 3.94815 8 4.62642 8 5.33366V26.667C8 27.3742 8.28095 28.0525 8.78105 28.5526C9.28115 29.0527 9.95942 29.3337 10.6667 29.3337H21.3333C22.0406 29.3337 22.7189 29.0527 23.219 28.5526C23.7191 28.0525 24 27.3742 24 26.667V5.33366C24 4.62642 23.7191 3.94815 23.219 3.44805C22.7189 2.94795 22.0406 2.66699 21.3333 2.66699Z" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 24H16.0133" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8H20" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="sr-only">StartupOps</span>
        </Link>
        <h1 className="text-2xl font-bold font-headline ml-2">StartupOps</h1>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Login
          </Link>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              {heroImage && 
                <Image
                  src={heroImage.imageUrl}
                  alt="Hero"
                  width={1200}
                  height={800}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                  data-ai-hint={heroImage.imageHint}
                />
              }
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <span className="text-sm font-semibold tracking-wide text-muted-foreground font-headline">Udyamitsav ‘26</span>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                    Rise Beyond Boundaries
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    StartupOps is the unified digital platform for early-stage founders. Manage execution, validate ideas, and gain actionable insights to scale efficiently.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">
                      Innovate. Build. Succeed.
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">An Operating System for Your Startup</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From idea to investor-ready, StartupOps provides the digital infrastructure you need to stay organized, focused, and data-driven.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="text-lg font-bold">{feature}</h3>
                    <p className="text-sm text-muted-foreground">Streamline your workflow with our intuitive and powerful features.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Ready to Build Your Legacy?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join StartupOps and transform your vision into a successful venture. Let&apos;s build the future together.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full">
                <Link href="/login">
                  Start for Free
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Begin your journey with our comprehensive free plan.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 StartupOps. A project for Techpreneur, IIT Jammu.</p>
        <div className="sm:ml-auto flex gap-4 sm:gap-6 text-xs text-muted-foreground">
          <span>Udyamitsav ‘26</span>
          <span>Indian Institute of Technology Jammu</span>
        </div>
      </footer>
    </div>
  );
}
