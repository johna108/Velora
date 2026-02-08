import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Rocket, Users, TrendingUp, Globe, Zap, Shield } from "lucide-react";
import { getPublicStartups, getAuthUser } from "@/lib/db";

export default async function Home() {
  const publicStartups = await getPublicStartups();
  const user = await getAuthUser();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground selection:bg-primary/20">
      <header className="px-6 lg:px-10 h-20 flex items-center border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <Link href="/" className="flex items-center justify-center gap-2 transition-opacity hover:opacity-80" prefetch={false}>
          <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M21.3333 2.66699H10.6667C9.95942 2.66699 9.28115 2.94795 8.78105 3.44805C8.28095 3.94815 8 4.62642 8 5.33366V26.667C8 27.3742 8.28095 28.0525 8.78105 28.5526C9.28115 29.0527 9.95942 29.3337 10.6667 29.3337H21.3333C22.0406 29.3337 22.7189 29.0527 23.219 28.5526C23.7191 28.0525 24 27.3742 24 26.667V5.33366C24 4.62642 23.7191 3.94815 23.219 3.44805C22.7189 2.94795 22.0406 2.66699 21.3333 2.66699Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 24H16.0133" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold font-headline tracking-tight">Velora</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          {user ? (
             <Button asChild className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
               <Link href="/dashboard">Dashboard</Link>
             </Button>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Sign In
              </Link>
              <Button asChild className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                <Link href="/login">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </header>
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden bg-background">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              
              <div className="space-y-4 max-w-4xl mx-auto">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl xl:text-7xl/none font-headline animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both delay-100">
                  Fueling the Future of <span className="text-primary block md:inline">Innovation</span>
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200">
                  Connect with visionary founders, discover next-gen startups, and manage your venture—all in one unified ecosystem.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both delay-300">
                <Button asChild size="lg" className="rounded-full text-lg h-12 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                  <Link href={user ? "/dashboard" : "/login"}>Launch Your Startup <Rocket className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full text-lg h-12 border-primary/20 hover:bg-primary/5 hover:border-primary/50 transition-all">
                  <Link href="#discover">Explore Ecosystem</Link>
                </Button>
              </div>

              {/* Stats Ribbon - Removed as per request */}
              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 text-center opacity-70 animate-in fade-in delay-500 duration-1000">
                 <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold font-headline">500+</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Startups</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold font-headline">$50M+</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Raised</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold font-headline">2k+</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Founders</span>
                 </div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold font-headline">Global</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Reach</span>
                 </div>
              </div> */}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="w-full py-20 bg-card/30 border-y border-border/40 relative overflow-hidden">
           <div className="container px-4 md:px-6 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4">Why Velora?</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">We provide the infrastructure for the next generation of unicorns.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/30 hover:bg-background transition-all duration-300 group">
                   <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Rocket className="h-7 w-7 text-primary" />
                   </div>
                   <h3 className="text-xl font-bold mb-3">Launch Faster</h3>
                   <p className="text-muted-foreground leading-relaxed">Streamlined tools to go from idea to MVP. Validate your concept with real market feedback instantly.</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/30 hover:bg-background transition-all duration-300 group">
                   <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-7 w-7 text-primary" />
                   </div>
                   <h3 className="text-xl font-bold mb-3">Find Co-Founders</h3>
                   <p className="text-muted-foreground leading-relaxed">Match with talented developers, designers, and visionaries who share your passion and drive.</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/30 hover:bg-background transition-all duration-300 group">
                   <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-7 w-7 text-primary" />
                   </div>
                   <h3 className="text-xl font-bold mb-3">Scale & Raise</h3>
                   <p className="text-muted-foreground leading-relaxed">Get discovered by investors. Showcase your traction, roadmap, and metrics in one beautiful profile.</p>
                </div>
              </div>
           </div>
        </section>

        {/* STARTUPS GRID */}
        <section id="discover" className="w-full py-20 lg:py-32 bg-background relative">
          <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] bg-primary/5 blur-[120px] rounded-full"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
              <div className="space-y-2 text-center md:text-left">
                 <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter">Featured Startups</h2>
                 <p className="text-muted-foreground text-lg">
                    Discover the most promising ventures building on Velora.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full gap-2 border-primary/20 hover:border-primary hover:bg-primary/5">
                <Link href="/startups">
                  View All Startups <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
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
          </div>
        </section>
        
        {/* CTA SECTION */}
        <section className="w-full py-20 bg-background border-t border-border/40">
           <div className="container px-4 md:px-6">
              <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-primary/20 p-8 md:p-16 text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 -m-8 h-64 w-64 bg-primary/10 blur-[80px] rounded-full pointing-events-none"></div>
                 <div className="absolute bottom-0 left-0 -m-8 h-64 w-64 bg-primary/10 blur-[80px] rounded-full pointing-events-none"></div>
                 
                 <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tight">Ready to Build the Future?</h2>
                    <p className="text-xl text-muted-foreground">Join thousands of founders and investors building the next generation of companies.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                      <Button asChild size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20">
                        <Link href={user ? "/dashboard" : "/login"}>Get Started Now</Link>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent border-primary/20 hover:bg-primary/10">
                        <Link href="/login">Contact Sales</Link>
                      </Button>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>
      
      <footer className="w-full py-12 bg-zinc-950 border-t border-border/40 text-sm">
         <div className="container px-4 md:px-6 grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <div className="bg-primary/20 p-1 rounded-md">
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M21.3333 2.66699H10.6667C9.95942 2.66699 9.28115 2.94795 8.78105 3.44805C8.28095 3.94815 8 4.62642 8 5.33366V26.667C8 27.3742 8.28095 28.0525 8.78105 28.5526C9.28115 29.0527 9.95942 29.3337 10.6667 29.3337H21.3333C22.0406 29.3337 22.7189 29.0527 23.219 28.5526C23.7191 28.0525 24 27.3742 24 26.667V5.33366C24 4.62642 23.7191 3.94815 23.219 3.44805C22.7189 2.94795 22.0406 2.66699 21.3333 2.66699Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                 </div>
                 <span className="font-bold font-headline text-lg">Velora</span>
               </div>
               <p className="text-muted-foreground">The operating system for the next generation of startups.</p>
            </div>
            <div>
               <h4 className="font-bold mb-4">Platform</h4>
               <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Startups</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Investors</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-4">Company</h4>
               <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-4">Legal</h4>
               <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
               </ul>
            </div>
         </div>
         <div className="container px-4 md:px-6 border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>&copy; 2026 Velora. All rights reserved.</p>
            <div className="flex gap-4">
               <div className="h-4 w-4 bg-muted-foreground/20 rounded-full"></div>
               <div className="h-4 w-4 bg-muted-foreground/20 rounded-full"></div>
               <div className="h-4 w-4 bg-muted-foreground/20 rounded-full"></div>
            </div>
         </div>
      </footer>
    </div>
  );
}
