import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicStartups, getAuthUser } from "@/lib/db";
import { ArrowLeft, Rocket } from "lucide-react";
import Link from "next/link";

export default async function StartupsPage() {
  const publicStartups = await getPublicStartups();
  const user = await getAuthUser();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 lg:px-10 h-20 flex items-center border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <Link href="/" className="flex items-center justify-center gap-2 transition-opacity hover:opacity-80">
           <ArrowLeft className="h-5 w-5" />
           <span className="font-medium">Back to Home</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="flex items-center justify-center gap-2 transition-opacity hover:opacity-80">
            <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M21.3333 2.66699H10.6667C9.95942 2.66699 9.28115 2.94795 8.78105 3.44805C8.28095 3.94815 8 4.62642 8 5.33366V26.667C8 27.3742 8.28095 28.0525 8.78105 28.5526C9.28115 29.0527 9.95942 29.3337 10.6667 29.3337H21.3333C22.0406 29.3337 22.7189 29.0527 23.219 28.5526C23.7191 28.0525 24 27.3742 24 26.667V5.33366C24 4.62642 23.7191 3.94815 23.219 3.44805C22.7189 2.94795 22.0406 2.66699 21.3333 2.66699Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <span className="text-xl font-bold font-headline tracking-tight">Velora</span>
            </Link>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-12">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h1 className="text-3xl md:text-5xl font-bold font-headline">Explore Innovative Startups</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
                Discover the next generation of companies built with Velora.
            </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {publicStartups.length > 0 ? (
            publicStartups.map((startup) => (
                <Card key={startup.id} className="group relative flex flex-col overflow-hidden border-border/60 bg-card/40 hover:bg-card/80 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 rounded-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{startup.name}</CardTitle>
                        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            {startup.industry}
                        </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Rocket className="h-4 w-4" />
                    </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {startup.description}
                    </p>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button asChild className="w-full rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group-hover:translate-y-0 text-secondary-foreground" variant="secondary">
                    <Link href={`/startup/${startup.id}`}>
                        View Details
                    </Link>
                    </Button>
                </CardFooter>
                </Card>
            ))
            ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-card/20 text-center">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Rocket className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No public startups yet</h3>
                <p className="text-muted-foreground mb-6">Be the first visionary to launch on Velora.</p>
                <Button asChild>
                <Link href={user ? "/dashboard" : "/login"}>Create Startup</Link>
                </Button>
            </div>
            )}
        </div>
      </main>
    </div>
  );
}
